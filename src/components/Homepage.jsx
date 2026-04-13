import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import html2pdf from "html2pdf.js";
import { PDFDocument } from "pdf-lib";
import { Layout } from "./Layout";
import { Modal } from "./Modal";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

const navigate = useNavigate();

const PAGE_HEIGHT_PX = 1110;

const editorRefs = useRef({});

const [pages,setPages] = useState([
{
pageno:1,
content:"",
pdfFiles:[],
open:true
}
]);

const [name,setName] = useState("");
const [loading,setLoading] = useState(false);
const [isModalOpen,setIsModalOpen] = useState(false);
const [pageImages, setPageImages] = useState({});
const [pdff,setpdff]=useState({});
const config = {
readonly:false,
placeholder:"Write content here...",
height:350,
 enableDragAndDropFileToEditor: true,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_as_html",
};



/* PAGE TOGGLE */

const togglePage = (index) => {

setPages(prev =>
prev.map((p,i)=>
i===index ? {...p,open:!p.open} : p
)
);

};



/* ADD PAGE */

const addPage = () => {

setPages(prev=>[
...prev,
{
pageno:prev.length+1,
content:"",
pdfFiles:[],
open:true
}
]);

};
/* MEASURE HEIGHT */

const measureContentHeight = (html)=>{

const temp=document.createElement("div");

temp.style.width="210mm";
temp.style.padding="20mm";
temp.style.position="absolute";
temp.style.visibility="hidden";
temp.style.fontSize="24px";

temp.innerHTML=html;

document.body.appendChild(temp);

const height=temp.scrollHeight;

document.body.removeChild(temp);

return height;

};



/* SAVE BUTTON */

const savePageContent = (index)=>{

const editor = editorRefs.current[index];

if(!editor) return;
const html = editor.value || editor.editor?.value || "";

const height = measureContentHeight(html);

if(height > PAGE_HEIGHT_PX){

alert("⚠ Page is full. Please create a new page.");
return;

}

setPages(prev=>{

const updated=[...prev];

updated[index].content = html;

return updated;

});

};



/* IMAGE UPLOAD */

// const handleImageUpload=(index,e)=>{
 
// const files=Array.from(e.target.files);
//  setPageImages(prev => ({
//     ...prev,
//     [index]: [
//       ...(prev[index] || []),
//       ...files
//     ]
//   }));
// const editor = editorRefs.current[index];
// if(!editor) return;

// files.forEach(file=>{

// const signature=file.name+file.size;

// const currentContent = editor.value || editor.editor?.value || "";

// if(currentContent.includes(signature)) return;

// const url=URL.createObjectURL(file);

// editor.value += `
// <div data-img="${signature}" style="text-align:center;margin-top:10px;">
// <img src="${url}" style="width:100%;height:auto;" />
// </div>
// `;

// });

// e.target.value="";

// };

const handleImageUpload = (index, e) => {

  const files = Array.from(e.target.files);

  setPageImages(prev => ({
    ...prev,
    [index]: [
      ...(prev[index] || []),
      ...files
    ]
  }));

  files.forEach(file => {

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    img.onload = () => {

      // ✅ RE-GET editor inside onload
      const editor = editorRefs.current[index];
      if (!editor) return;

      const currentContent =
        editor.value || editor.editor?.value || "";

      const currentHeight = measureContentHeight(currentContent);

      const remainingHeight =
        PAGE_HEIGHT_PX - (currentHeight % PAGE_HEIGHT_PX);

      const signature = file.name + file.size;

      if (currentContent.includes(signature)) return;

      const imageTag = `
        <div data-img="${signature}" style="text-align:center;margin-top:10px;">
          <img 
            src="${url}" 
            style="
              width:100%;
              height:auto;
              max-height:${remainingHeight-10}px;
              object-fit:contain;
            "
          />
        </div>
      `;

      // ✅ SAFE SET VALUE
      if (editor.value !== undefined) {
        editor.value = currentContent + imageTag;
      } else if (editor.editor) {
        editor.editor.value = currentContent + imageTag;
      }

    };
  });

  e.target.value = "";
};



/* PDF UPLOAD */

const handlePdfUpload=(index,e)=>{

const files = Array.from(e.target.files);
setpdff(prev => ({
    ...prev,
    [index]: [
      ...(prev[index] || []),
      ...files
    ]
  }));

setPages(prev=>{

const updated=[...prev];

files.forEach(file=>{

const exists = updated[index].pdfFiles.some(
f=>f.name===file.name && f.size===file.size
);

if(!exists){
updated[index].pdfFiles.push(file);
}

});

return updated;

});

e.target.value="";

};



/* HTML → PDF */

const pageToPdfBlob = async (html) => {

  const container = document.createElement("div");
  const pageDiv = document.createElement("div"); // ✅ FIX

  pageDiv.style.width = "210mm";
  pageDiv.style.padding = "20mm";
  pageDiv.style.minHeight = "295mm";
  pageDiv.style.fontSize = "24px";

  pageDiv.innerHTML = html;

  container.appendChild(pageDiv);

  const opt = {
    margin: 0,
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  const blob = await html2pdf()
    .set(opt)
    .from(container)
    .outputPdf("blob");

  container.remove();

  return blob;
};



/* CREATE FLIPBOOK */

const mergeAndShowFlipbook = async ()=>{

if(name===""){
alert("Enter Flipbook Name");
return;
}

setLoading(true);







const mergedPdf=await PDFDocument.create();

const appendPdf = async (blob)=>{

const bytes=await blob.arrayBuffer();

const pdf=await PDFDocument.load(bytes);
const copiedPages=await mergedPdf.copyPages(pdf,pdf.getPageIndices());

copiedPages.forEach(p=>mergedPdf.addPage(p));

};


for(const pg of pages){

if(pg.content && pg.content.trim()!==""){

const pageBlob=await pageToPdfBlob(pg.content);

await appendPdf(pageBlob);

}

for(const file of pg.pdfFiles){

await appendPdf(file);

}

}


const finalBytes=await mergedPdf.save();

const finalBlob=new Blob([finalBytes],{type:"application/pdf"});

const formData=new FormData();

formData.append("file",finalBlob,name);
try{

const response=await fetch(
"http://flipbook.mitchell-railgear.com/api/multer/upload",
{
method:"POST",
body:formData
}
);

setLoading(false);

if(response.ok){

alert("Flipbook Created");
navigate("/");

}

}catch(err){

console.error(err);
setLoading(false);

}

};



return(
<>

{loading ? <Loader/> : (

<Layout>

<div className="flex min-h-screen bg-blue-50 ">

{/* LEFT PANEL */}

<div className="fixed h-screen overflow-y-auto p-4 bg-white shadow w-[26%]">

{pages.map((pg,index)=>(

<div key={pg.pageno} className="border mb-4 rounded">

<div
className="bg-blue-600 text-white p-3 cursor-pointer"
onClick={()=>togglePage(index)}
>
Page {pg.pageno}
</div>

{pg.open && (

<div className="p-3">

<JoditEditor
  ref={(el)=>editorRefs.current[index]=el}
  value={pg.content}
  config={config}
  onBlur={(newContent)=>{
    setPages(prev=>{
      const updated=[...prev];
      updated[index].content=newContent;
      return updated;
    });
  }}
/>
<button
onClick={()=>savePageContent(index)}
className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
>
Save Changes
</button>

<label className="block mt-3">Upload Image</label>

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>handleImageUpload(index,e)}
className="border p-2 rounded-lg"
/>
 <ul>
      {(pageImages[index] || []).map((file, i) => (
        <li key={i}>{file.name}</li>
      ))}
    </ul>
<label className="block mt-3">Upload PDF</label>

<input
type="file"
multiple
accept="application/pdf"
onChange={(e)=>handlePdfUpload(index,e)}
className="border p-2 rounded-lg"
/>
 <ul>
      {(pdff[index] || []).map((file, i) => (
        <li key={i}>{file.name}</li>
      ))}
    </ul>
</div>

)}

</div>
))}

<button
onClick={addPage}
className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
>
+ Add Page
</button>

<button
onClick={()=>setIsModalOpen(true)}
className="bg-green-600 text-white px-4 py-2 rounded mt-3 ml-2"
>
Create Flipbook
</button>

</div>



{/* RIGHT PANEL PREVIEW */}

<div className=" p-6 overflow-y-auto  ml-[30%]">

{pages.map(pg=>(

<div
key={pg.pageno}
className="w-[210mm] min-h-[297mm] bg-white shadow mx-auto mb-6 p-6 overflow-hidden"
>

<div
dangerouslySetInnerHTML={{__html:pg.content}}
style={{fontSize:"24px"}}
/>

</div>

))}

</div>

</div>



{/* MODAL */}

<Modal IsOpen={isModalOpen}>

<div className="p-4 flex justify-end">
<button onClick={()=>setIsModalOpen(false)}>X</button>
</div>

<div className="flex flex-col gap-4 w-80 mx-auto">

<h2 className="text-xl font-bold text-center">
Enter Flipbook Name
</h2>

<input
type="text"
value={name}
onChange={e=>setName(e.target.value)}
className="border p-2"
/>

<button
onClick={mergeAndShowFlipbook}
className="bg-blue-600 text-white p-2 rounded"
>
Submit
</button>

</div>

</Modal>

</Layout>

)}

</>

);

};

export default Homepage;

