// import React, { useEffect, useState, useRef,useContext } from "react";
// import { PDFDocument } from "pdf-lib";
// import { useParams } from "react-router-dom";
// import { Layout } from "./Layout";
// import { Templateurl } from "../context/Templateurl";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// export const Fileviewer = () => {
//   const { id } = useParams();
//   const {templateurl}=useContext(Templateurl);
//   const [pdfPages, setPdfPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [showShare, setShowShare] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const flipBook = useRef();

//   useEffect(() => {
//     const loadPDF = async () => {
//       try {
//         const res = await fetch(`http://flipbook.mitchell-railgear.com/api/multer/file/${id}`);
//             const contentDisposition = res.headers.get("content-disposition");

//     if (contentDisposition) {
//       const match = contentDisposition.match(/filename="?(.+?)"?$/);
//       if (match) {
//         setFileName(match[1]);
//       }
//     }

//     console.log("File Name:", fileName);
//         let blob = await res.blob();
//         blob = await removeBlankPages(blob);
//         const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob))
//           .promise;
//         const pages = [];
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const vp = page.getViewport({ scale: 1.5 });
//           const canvas = document.createElement("canvas");
//           canvas.width = vp.width;
//           canvas.height = vp.height;
//           await page.render({
//             canvasContext: canvas.getContext("2d"),
//             viewport: vp,
//           }).promise;
//           pages.push(canvas.toDataURL());
//         }
//         setPdfPages(pages);
//         setTotalPages(pages.length + 2); // cover + end page
//       } catch (err) {
//         console.error("PDF load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPDF();
//   }, [id]);

// const removeBlankPages = async (pdfBlob) => {
//   const pdfBytes = await pdfBlob.arrayBuffer();
//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   const newPdf = await PDFDocument.create();
//   const pages = pdfDoc.getPages();

//   for (let i = 0; i < pages.length; i++) {
//     const page = pages[i];
//     const ops = page.node?.Normal?.get("Contents");

//     // ✅ Detect truly empty pages based on missing content streams
//     if (!ops || (Array.isArray(ops) && ops.length === 0)) continue;

//     // Copy non-blank pages
//     const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
//     newPdf.addPage(copiedPage);
//   }

//   // If somehow all pages were skipped, just keep original
//   if (newPdf.getPageCount() === 0) {
//     console.warn("⚠️ All pages detected as blank — keeping original PDF");
//     return pdfBlob;
//   }

//   const cleanedPdfBytes = await newPdf.save();
//   return new Blob([cleanedPdfBytes], { type: "application/pdf" });
// };



  

//   const goNext = () => {
//     flipBook.current.pageFlip().flipNext();
//   };

//   const goPrev = () => {
//     flipBook.current.pageFlip().flipPrev();
//   };

//   const iframeCode = `<iframe src="http://flipbook.mitchell-railgear.com/flipbook/${id}" width="600" height="800" style="border:none;"></iframe>`;

//   if (loading) return <div className="text-center mt-20">📄 Loading PDF...</div>;

//   return (
//     <Layout>    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4">
//       {/* Flipbook Container */}
//             <h2 style={{ textAlign: "center", marginBottom: "10px",color:"white",fontWeight: "bold" }}>
//   📘 {fileName || "Loading..."}
// </h2>
//       <div className="relative">
//         {/* Previous Button */}
//         {currentPage > 0 && (
//           <button
//             onClick={goPrev}
//             className="absolute -left-24 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
//           >
//             ⬅ 
//           </button>
//         )}

//         {/* Flipbook */}
//         <HTMLFlipBook
//           width={400}
//           height={600}
//           showCover
//           mobileScrollSupport
//           ref={flipBook}
//           onFlip={(e) => setCurrentPage(e.data)}
//           usePortrait={false}     // 👈 IMPORTANT: shows 2 pages side-by-side
//   autoSize={true}
//   className="flipbook-shadow"
//         >
         
//           {pdfPages.map((src, idx) => (
//             <div key={idx} className="page bg-white">
//               <img
//                 src={src}
//                 alt={`Page ${idx + 1}`}
//                 className="w-full h-full object-fill"
//               />
//             </div>
//           ))}
          
//         </HTMLFlipBook>

//         {/* Next Button */}
//         {currentPage < totalPages - 1 && (
//           <button
//             onClick={goNext}
//             className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
//           >
//              ➡
//           </button>
//         )}
//       </div>

//       {/* Share Button */}
//       <div className="mt-6">
//         <button
//           onClick={() => setShowShare(!showShare)}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-500"
//         >
//           🔗 Share
//         </button>
//       </div>

//       {/* Iframe Embed Code */}
//       {showShare && (
//         <div className="mt-4 w-full max-w-xl bg-white p-4 rounded-lg shadow-md">
//           <p className="font-semibold mb-2">Embed this flipbook:</p>
//           <textarea
//             readOnly
//             value={iframeCode}
//             className="w-full p-2 border rounded bg-gray-100 text-sm font-mono"
//             rows="3"
//             onClick={(e) => e.target.select()}
//           />
//           <p className="text-xs text-gray-500 mt-2">
//             Copy this iframe code and paste it into any website.
//           </p>
//         </div>
//       )}
//     </div>
//     </Layout>
//   );
// };

// export default Fileviewer;


import React, { useEffect, useState, useRef, useContext } from "react";
import { PDFDocument } from "pdf-lib";
import { useParams } from "react-router-dom";
import { Layout } from "./Layout";
import { Templateurl } from "../context/Templateurl";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const Fileviewer = () => {
  const { id } = useParams();
  const { templateurl } = useContext(Templateurl);

  const [pdfPages, setPdfPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [fileName, setFileName] = useState("");

  const flipBook = useRef();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await fetch(
          `http://flipbook.mitchell-railgear.com/api/multer/file/${id}`
        );

        const contentDisposition = res.headers.get("content-disposition");
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+?)"?$/);
          if (match) setFileName(match[1]);
        }

        let blob = await res.blob();
        blob = await removeBlankPages(blob);

        const pdf = await pdfjsLib
          .getDocument(URL.createObjectURL(blob))
          .promise;

        setTotalPages(pdf.numPages);

        const pages = [];
        const initialLoad = Math.min(4, pdf.numPages);

        // 🔥 Load first 4 pages fast
        for (let i = 1; i <= initialLoad; i++) {
          const img = await renderPage(pdf, i);
          pages.push(img);
        }

        setPdfPages(pages);
        setLoading(false);

        // 🔥 Load remaining pages in background
        setTimeout(async () => {
          for (let i = initialLoad + 1; i <= pdf.numPages; i++) {
            const img = await renderPage(pdf, i);

            setPdfPages((prev) => [...prev, img]);
          }
        }, 100);
      } catch (err) {
        console.error("PDF load error:", err);
        setLoading(false);
      }
    };

    loadPDF();
  }, [id]);

  // 🔥 Render single page
  const renderPage = async (pdf, pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const vp = page.getViewport({ scale: 1.2 });

    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport: vp,
    }).promise;

    // ⚡ Use blob URL (better than base64)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
  };

  // 🔥 Remove blank pages
  const removeBlankPages = async (pdfBlob) => {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const ops = page.node?.Normal?.get("Contents");

      if (!ops || (Array.isArray(ops) && ops.length === 0)) continue;

      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
    }

    if (newPdf.getPageCount() === 0) return pdfBlob;

    const cleanedPdfBytes = await newPdf.save();
    return new Blob([cleanedPdfBytes], { type: "application/pdf" });
  };

  const goNext = () => flipBook.current.pageFlip().flipNext();
  const goPrev = () => flipBook.current.pageFlip().flipPrev();

  const iframeCode = `<iframe src="http://flipbook.mitchell-railgear.com/flipbook/${id}" width="600" height="800" style="border:none;"></iframe>`;

  if (loading)
    return <div className="text-center mt-20">📄 Loading PDF...</div>;

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4">
        <h2 className="text-white font-bold mb-4">
          📘 {fileName || "Loading..."}
        </h2>

<div className="relative flex justify-center items-center gap-4  w-[60%]">
{/* Prev Button */}
  {currentPage > 0 && (
    <button
      onClick={goPrev}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gray-800 text-white px-4 py-2 rounded-full z-10 cursor-pointer"
    >
      ⬅
    </button>
  )}
        <div className="relative overflow-hidden">
          {/* Prev */}
          

          {/* Flipbook */}
          <HTMLFlipBook
            width={400}
            height={600}
            showCover
            mobileScrollSupport
            ref={flipBook}
            onFlip={(e) => setCurrentPage(e.data)}
            usePortrait={false}
            autoSize
          >
            {pdfPages.map((src, idx) => (
              <div key={idx} className="bg-white">
                <img
                  src={src}
                  alt={`Page ${idx + 1}`}
                  className="w-full h-full object-fill"
                />
              </div>
            ))}
          </HTMLFlipBook>

          {/* Next */}
         
        </div>
 {currentPage < pdfPages.length - 1 && (
    <button
      onClick={goNext}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-gray-800 text-white px-4 py-2 rounded-full z-10 cursor-pointer"
    >
      ➡
    </button>
  )}
</div>
        {/* Share */}
        <div className="mt-6">
          <button
            onClick={() => setShowShare(!showShare)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            🔗 Share
          </button>
        </div>

        {showShare && (
          <div className="mt-4 w-full max-w-xl bg-white p-4 rounded-lg">
            <p className="font-semibold mb-2">Embed this flipbook:</p>
            <textarea
              readOnly
              value={iframeCode}
              className="w-full p-2 border rounded bg-gray-100 text-sm"
              rows="3"
              onClick={(e) => e.target.select()}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fileviewer;

// import React, { useEffect, useState, useRef, useContext } from "react";
// import { PDFDocument } from "pdf-lib";
// import { useParams } from "react-router-dom";
// import { Layout } from "./Layout";
// import { Templateurl } from "../context/Templateurl";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// export const Fileviewer = () => {
//   const { id } = useParams();
//   const { templateurl } = useContext(Templateurl);

//   const [pdf, setPdf] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [pages, setPages] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [showShare, setShowShare] = useState(false);

//   useEffect(() => {
//     const loadPDF = async () => {
//       const res = await fetch(
//         `http://flipbook.mitchell-railgear.com/api/multer/file/${id}`
//       );

//       const contentDisposition = res.headers.get("content-disposition");
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="?(.+?)"?$/);
//         if (match) setFileName(match[1]);
//       }

//       let blob = await res.blob();
//       blob = await removeBlankPages(blob);

//       const pdfDoc = await pdfjsLib
//         .getDocument(URL.createObjectURL(blob))
//         .promise;

//       setPdf(pdfDoc);

//       // 🔥 render all pages once (fast + stable)
//       const imgs = [];
//       for (let i = 1; i <= pdfDoc.numPages; i++) {
//         const page = await pdfDoc.getPage(i);
//         const vp = page.getViewport({ scale: 1.2 });

//         const canvas = document.createElement("canvas");
//         canvas.width = vp.width;
//         canvas.height = vp.height;

//         await page.render({
//           canvasContext: canvas.getContext("2d"),
//           viewport: vp,
//         }).promise;

//         imgs.push(canvas.toDataURL());
//       }

//       setPages(imgs);
//     };

//     loadPDF();
//   }, [id]);

//   const removeBlankPages = async (pdfBlob) => {
//     const pdfBytes = await pdfBlob.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const newPdf = await PDFDocument.create();
//     const pages = pdfDoc.getPages();

//     for (let i = 0; i < pages.length; i++) {
//       const page = pages[i];
//       const ops = page.node?.Normal?.get("Contents");

//       if (!ops || (Array.isArray(ops) && ops.length === 0)) continue;

//       const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
//       newPdf.addPage(copiedPage);
//     }

//     if (newPdf.getPageCount() === 0) return pdfBlob;

//     const cleanedPdfBytes = await newPdf.save();
//     return new Blob([cleanedPdfBytes], { type: "application/pdf" });
//   };

//   const next = () => {
//     if (current < pages.length - 2) setCurrent(current + 2);
//   };

//   const prev = () => {
//     if (current > 0) setCurrent(current - 2);
//   };

//   const iframeCode = `<iframe src="http://flipbook.mitchell-railgear.com/flipbook/${id}" width="600" height="800" style="border:none;"></iframe>`;

//   if (!pages.length)
//     return (
//       <Layout>
//         <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
//           📄 Loading...
//         </div>
//       </Layout>
//     );

//   return (
//     <Layout>
//       <div className="bg-gray-900 min-h-screen flex flex-col items-center p-4">
//         <h2 className="text-white font-bold mb-4">📘 {fileName}</h2>

//         {/* BOOK VIEW */}
//         <div className="relative flex items-center">
//           {/* LEFT PAGE */}
//           <img
//             src={pages[current]}
//             className="w-[300px] h-[450px] object-fill bg-white shadow-lg transition-all duration-500"
//           />

//           {/* RIGHT PAGE */}
//           <img
//             src={pages[current + 1]}
//             className="w-[300px] h-[450px] object-fill bg-white shadow-lg transition-all duration-500"
//           />

//           {/* PREV */}
//           {current > 0 && (
//             <button
//               onClick={prev}
//               className="absolute left-[-60px] bg-gray-800 text-white px-3 py-2 rounded"
//             >
//               ⬅
//             </button>
//           )}

//           {/* NEXT */}
//           {current < pages.length - 2 && (
//             <button
//               onClick={next}
//               className="absolute right-[-60px] bg-gray-800 text-white px-3 py-2 rounded"
//             >
//               ➡
//             </button>
//           )}
//         </div>

//         {/* SHARE */}
//         <div className="mt-6">
//           <button
//             onClick={() => setShowShare(!showShare)}
//             className="bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             🔗 Share
//           </button>
//         </div>

//         {showShare && (
//           <div className="mt-4 bg-white p-4 rounded w-full max-w-xl">
//             <textarea
//               value={iframeCode}
//               readOnly
//               className="w-full p-2 border"
//             />
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Fileviewer;