


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
const [bookSize, setBookSize] = useState({
  width: window.innerWidth * 0.3,
  height: window.innerHeight* 0.8
});
useEffect(() => {
  const handleResize = () => {
    setBookSize({
      width: window.innerWidth * 0.3,
      height: window.innerHeight * 0.8,
    });
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  
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

<div className="relative flex justify-center items-center gap-4  w-auto">
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
            width={bookSize.width}
            height={bookSize.height}
            showCover
            mobileScrollSupport
            ref={flipBook}
            onFlip={(e) => setCurrentPage(e.data)}
            usePortrait={false}
            autoSize
            className="flipbook-shadow"
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

