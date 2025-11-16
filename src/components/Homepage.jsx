import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import html2pdf from 'html2pdf.js';
import { PDFDocument } from 'pdf-lib';
import {Layout} from './Layout';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import Loader from './Loader';
const Homepage = () => {
  const [page,setpage]=useState([{pageno:1,content:""}]);
  const [content, setContent] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
  const [name,setName]=useState("");
  const [isModalOpen,setIsModalOpen]=useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: 'Start writing your content here...',
  };

const handleEdit = (pg) => {
    setCurrentPage(pg.pageno);
    setContent(pg.content || `edit pageno${pg.pageno}`);
  };
const PAGE_HEIGHT_PX = 1122; // A4 height at 96 DPI
const handleContentChange = (newContent) => {
  const temp = document.createElement('div');
  temp.style.width = '210mm';
  temp.style.padding = '20mm';
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.fontSize = '24px';
  temp.innerHTML = newContent;
  document.body.appendChild(temp);
  const height = temp.scrollHeight;
  document.body.removeChild(temp);

  // 2️⃣ If content exceeds A4 height — show alert and stop typing
  if (height > PAGE_HEIGHT_PX) {
    alert('⚠️ Page is full — please add a new page.');
    return; // prevent further writing
  }
    setContent(newContent);
    setpage((prevPages) =>
      prevPages.map((p) =>
        p.pageno === currentPage ? { ...p, content: newContent } : p
      )
    );
  };



  // ===== 👇 ADD THESE TWO FUNCTIONS after handleContentChange() =====

// Page height for A4 at 96 DPI


// Measure total height of current editor HTML content
const measureContentHeight = (html) => {
  const temp = document.createElement('div');
  temp.style.width = '210mm';
  temp.style.padding = '20mm';
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.fontSize = '24px';
  temp.innerHTML = html;
  document.body.appendChild(temp);
  const height = temp.scrollHeight;
  document.body.removeChild(temp);
  return height;
};

// Handle image uploads and adjust height if needed
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      const imageWidth = img.width;
      const imageHeight = img.height;

      const currentHeight = measureContentHeight(content);
      const remainingHeight = PAGE_HEIGHT_PX - (currentHeight % PAGE_HEIGHT_PX);

      // If image height is too tall, scale it down to fit remaining space
      let scaledHeight = imageHeight;
      let scaledWidth = imageWidth;

      if (scaledHeight > remainingHeight) {
        const scaleRatio = remainingHeight / scaledHeight;
        scaledHeight = remainingHeight;
        scaledWidth = imageWidth * scaleRatio;
      }

      // Insert image HTML
      const imageTag = `
        <div style="width: 100%; text-align: center; margin-top: 10px;">
          <img 
            src="${url}" 
            alt="Uploaded" 
            style="width: 100%; height: auto; max-height: ${remainingHeight}px; object-fit: contain;"
          />
        </div>
      `;

      setContent((prev) => prev + imageTag);
    };
  });
};

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const imageTags = files
  //     .map((file) => {
  //       const url = URL.createObjectURL(file);
  //       return `<img src="${url}" alt="Uploaded" style="width: 100%; margin-t" />`;
  //     })
  //     .join('');
  //   setContent(prev => prev + imageTags);
  // };

  const handlePdfUpload = (e) => {
    setPdfFiles(Array.from(e.target.files));
  };

  // Convert HTML to PDF blob
  // const htmlToPdfBlob = async () => {
  //   const el = document.createElement('div');
  //   el.innerHTML = content;
  //   const opt = {
  //     margin: 1,
  //     filename: 'content.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: {},
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  //   };
  //   const pdfBlob = await html2pdf().set(opt).from(el).outputPdf('blob');
  //   return pdfBlob;
  // };
//   const htmlToPdfBlob = async (page) => {
//   // Create a container for all pages
//   const container = document.createElement("div");
//   container.style.width = "210mm"; // A4 width
//   container.style.minHeight = "297mm";
//   container.style.background = "#fff";
//   container.style.fontSize = "14px"; // preserve your editor font size
//   container.style.fontFamily = "Arial, sans-serif";

//   // Loop through all pages and add each to the container
//   page.forEach((pg, index) => {
//     if (!pg?.content || pg?.content.trim() === "") return;
//     const pageDiv = document.createElement("div");
//     pageDiv.style.width = "210mm";
//     pageDiv.style.height = "297mm";
//     pageDiv.style.overflow = "hidden";
//     pageDiv.style.boxSizing = "border-box";
//     pageDiv.style.padding = "20mm";
//     pageDiv.innerHTML = pg.content;
//     container.appendChild(pageDiv);
//   });

//   // PDF generation options
//   const opt = {
//     margin: 0,
//     filename: "content.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   };

//   // Generate and return as Blob
//   const pdfBlob = await html2pdf().set(opt).from(container).outputPdf("blob");
//   return pdfBlob;
// };
// const htmlToPdfBlob = async (page) => {
//   const container = document.createElement("div");
//   container.style.width = "210mm";
//   container.style.background = "#fff";
//   container.style.fontSize = "24px";
//   container.style.lineHeight = "1.5";
//   container.style.fontFamily = "Arial, sans-serif";
//   container.style.margin = "0";
//   container.style.padding = "0";

//   // ✅ Instead of forcing each to a separate PDF page,
//   // append them in sequence (continuous)
//   page.forEach((pg, index) => {
//     if (!pg?.content || pg?.content.trim() === "") return;

//     const pageDiv = document.createElement("div");
//     pageDiv.style.width = "210mm";
//     pageDiv.style.minHeight = "297mm";
//     pageDiv.style.boxSizing = "border-box";
//     pageDiv.style.padding = "20mm";
//     pageDiv.style.margin = "0 auto";
//     pageDiv.innerHTML = pg.content;

//     // ✅ Only add page break AFTER each page except the last
//     // if (index < page.length - 1) {
//     //   pageDiv.style.pageBreakAfter = "always";
//     // }

//     container.appendChild(pageDiv);
//   });
//   // PDF generation options
//   const opt = {
//     margin: 0,
//     filename: "content.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // ✅ avoid blank page
//   };

//   // Generate and return as Blob
//   const pdfBlob = await html2pdf().set(opt).from(container).outputPdf("blob");
//   return pdfBlob;
// };
const htmlToPdfBlob = async (pages) => {
  const container = document.createElement("div");
  container.style.width = "210mm";
  container.style.background = "#fff";
  container.style.fontSize = "24px";
  container.style.lineHeight = "1.5";
  container.style.fontFamily = "Arial, sans-serif";

  pages.forEach((pg) => {
    if (!pg?.content || pg?.content.trim() === "") return;

    const pageDiv = document.createElement("div");
    pageDiv.style.width = "210mm";
    pageDiv.style.boxSizing = "border-box";
    pageDiv.style.padding = "20mm";
    pageDiv.style.minHeight = "295mm";
    
    // ❌ IMPORTANT: REMOVE minHeight (was causing extra blank pages)
    // pageDiv.style.minHeight = "297mm";

    pageDiv.innerHTML = pg.content;
    container.appendChild(pageDiv);
  });

  const opt = {
    margin: 0,
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: false
  };

  return await html2pdf().set(opt).from(container).outputPdf("blob");
};





  const mergeAndShowFlipbook = async () => {
    if(name===""){
      alert("Please enter a name for the flipbook");
      return;
    }else if(content===""){
      alert("Content cannot be empty");
      return;
    }
    else{
    const contentPdfBlob = await htmlToPdfBlob(page);
    const mergedPdf = await PDFDocument.create();

    // const loadAndAppend = async (pdfBlob) => {
    //   const pdfBytes = await pdfBlob.arrayBuffer();
    //   const pdf = await PDFDocument.load(pdfBytes);
    //   const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    //   copiedPages.forEach((page) => mergedPdf.addPage(page));
    // };

//     const loadAndAppend = async (pdfBlob) => {
//   const pdfBytes = await pdfBlob.arrayBuffer();
//   const pdf = await PDFDocument.load(pdfBytes);
//   const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

//   copiedPages.forEach((page, index) => {
//     const pageRef = pdf.getPage(index);
//     const { width, height } = pageRef.getSize();

//     // ⚙️ Detect empty page (no text, very small height, or white background)
//     const textContent = pageRef.getTextContent ? pageRef.getTextContent() : [];
//     const isBlank =
//       height < 50 || (textContent && textContent.items && textContent.items.length === 0);

//     if (!isBlank) {
//       mergedPdf.addPage(page);
//     }
//   });
// };
const loadAndAppend = async (pdfBlob) => {
  const pdfBytes = await pdfBlob.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  copied.forEach(page => mergedPdf.addPage(page));
};


  
    await loadAndAppend(contentPdfBlob);

    
    for (const file of pdfFiles) {
      await loadAndAppend(file);
    }

    const finalPdfBytes = await mergedPdf.save();
 const finalPdfBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('file', finalPdfBlob, name);
   setLoading(true);
  try {
    const response = await fetch('http://flipbook.mitchell-railgear.com/api/multer/upload', {
      method: 'POST',
      body: formData,
    });
      
    if (!response.ok) {
      setLoading(false);
      throw new Error('Failed to upload PDF');
    }

    const result = await response.json();
    console.log('Upload success:', result); 
    alert('Flipbook created successfully!');
    setLoading(false);
navigate("/");
  } catch (err) {
    console.error('Error uploading PDF:', err);
  }
}
  };

const handleSave = () => {
    if (currentPage === null) return;

    // Update only the selected page content
    setpage((prev) =>
      prev.map((p) =>
        p.pageno === currentPage ? { ...p, content } : p
      )
    );

    // Optional: clear editor after save
    // setContent("");
    // setSelectedPage(null);
  };



  return (<>
    {loading==true ? (<Loader/>):
    (<Layout>
      <div className="flex min-h-screen bg-blue-50 gap-2">
    
      <div className="sidebar w-[30%]  p-4 shadow-md rounded-lg flex flex-col gap-4 bg-blue-50">
        <JoditEditor
          ref={editor}
          value={content}
           config={{
    ...config,
    height: 600, 
    minHeight:350,
    maxWidth:350,
    readonly: false,
    toolbarAdaptive: false,
    toolbarSticky: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    pastePlain: false, // allows rich text paste
    enableDragAndDropFileToEditor: true,
    useFontSizeStyle: true,
    defaultFontSize: '24',
    style: {
      fontSize: '24px',
      lineHeight: '1.6',
      fontFamily: 'Arial, sans-serif',
    },
  }}
          tabIndex={1}
          onBlur={(newContent) => handleContentChange(newContent)}
          style={{ minHeight: '40vh' }}
        />

       <div className='gap-2 flex justify-between'>
         <button
          onClick={handleSave}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Save Content
        </button>
        <button
          onClick={() => setpage(prev=>[...prev,{pageno:prev.length+1,content:""}])}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
         + Add Page
        </button>

       </div>
        <label htmlFor="image" className="capitalize font-medium">Upload Image</label>
        <input
          id="image"
          type="file"
          multiple
          accept="image/*"
          className="border p-2 rounded-md cursor-pointer"
          onChange={handleImageUpload}
        />

        <label htmlFor="file" className="capitalize font-medium">Upload PDF File</label>
        <input
          id="file"
          type="file"
          multiple
          accept="application/pdf"
          className="border p-2 rounded-md cursor-pointer"
          onChange={handlePdfUpload}
        />

        <button
          onClick={()=>setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
        >
          Create Flipbook
        </button>
      </div>

      {/* Content Preview */}
      <div className="content w-full p-2 ">
        <div className=" rounded flex gap-5 grid grid-cols-1 ">
{/* Pages Preview */}
      {page.map((pg) => (
        <div
          key={pg.pageno}
          className="w-[210mm] h-[247mm] rounded-md bg-white shadow-md mx-auto my-4 p-5 "
        >
          {pg.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: pg.content }}
              className="h-full w-full overflow-hidden break-words"
              style={{ fontSize: '24px', lineHeight: '1.6' }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold gap-2">
              Page {pg.pageno} - No Content{" "}
              <button
                onClick={() => handleEdit(pg)}
                className="border px-2 rounded text-white bg-blue-600 cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
          {pg.content && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleEdit(pg)}
                className="border px-2 rounded text-white bg-blue-600 cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        
      ))}

          
        </div>
      </div>

    </div>
    <Modal IsOpen={isModalOpen} >
       <div className='w-full p-2 flex justify-end'>
                    <button className=' text-gray-600 hover:text-gray-800 font-bold text-2xl cursor-pointer' onClick={() => setIsModalOpen(false)}>X</button>
                </div>
        <div className='flex flex-col gap-8 w-96 mx-auto'>
           <h2 className='text-2xl text-center text-black font-bold'>Enter A Flip Book Name </h2>
          <input type="text" placeholder='Enter Name' className='border-blue-500  border outline-none p-2 rounded-md w-full' value={name} onChange={(e)=>setName(e.target.value)}/>
          <div className='
          flex justify-center'>
            <button className=' py-2 px-6  rounded-lg bg-blue-500 text-white font-bold text-md cursor-pointer hover:bg-blue-400 hover:-translate-y-1 transform' onClick={mergeAndShowFlipbook}>Submit</button>
          </div>
        </div>
    </Modal>
    </Layout>)}
    </>
  );
};

export default Homepage;
   