import React, { useEffect, useState, useRef,useContext } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "./Layout";
import { Templateurl } from "../context/Templateurl";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const Fileviewer = () => {
  const { id } = useParams();
  const {templateurl}=useContext(Templateurl);
  const [pdfPages, setPdfPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showShare, setShowShare] = useState(false);
  
  const flipBook = useRef();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await fetch(`http://flipbook.mitchell-railgear.com/api/multer/file/${id}`);
        const blob = await res.blob();
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob))
          .promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport: vp,
          }).promise;
          pages.push(canvas.toDataURL());
        }
        setPdfPages(pages);
        setTotalPages(pages.length + 2); // cover + end page
      } catch (err) {
        console.error("PDF load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [id]);

useEffect(() => {
  if (!loading && flipBook.current) {
    const timer = setTimeout(() => {
      flipBook.current.pageFlip().flipNext();
    }, 800); // open the cover after load
    return () => clearTimeout(timer);
  }
}, [loading]);  

  const goNext = () => {
    flipBook.current.pageFlip().flipNext();
  };

  const goPrev = () => {
    flipBook.current.pageFlip().flipPrev();
  };

  const iframeCode = `<iframe src="http://flipbook.mitchell-railgear.com/flipbook/${id}" width="600" height="800" style="border:none;"></iframe>`;

  if (loading) return <div className="text-center mt-20">📄 Loading PDF...</div>;

  return (
    <Layout>    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Flipbook Container */}
      <div className="relative">
        {/* Previous Button */}
        {currentPage > 0 && (
          <button
            onClick={goPrev}
            className="absolute -left-24 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
          >
            ⬅ 
          </button>
        )}

        {/* Flipbook */}
        <HTMLFlipBook
          width={400}
          height={600}
          showCover
          mobileScrollSupport
          ref={flipBook}
          onFlip={(e) => setCurrentPage(e.data)}
          usePortrait={false}     // 👈 IMPORTANT: shows 2 pages side-by-side
  autoSize={true}
        >
          <div
  className={`bg-white flex items-center justify-center bg-cover bg-center  `}     >
             <div className={`dynamicstart-bg w-full h-full object-contain`} style={{ '--templatestart-url': `url(${templateurl?.start?.replace(/\\/g, '/')})` }}></div>
          </div>
          {pdfPages.map((src, idx) => (
            <div key={idx} className="page bg-white">
              <img
                src={src}
                alt={`Page ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          <div className=" bg-white flex items-center justify-center bg-cover bg-center ">
             <div className={`dynamicend-bg w-full h-full `} style={{ '--templateend-url': `url(${templateurl?.end?.replace(/\\/g, '/')})` }}></div>
          </div>
        </HTMLFlipBook>

        {/* Next Button */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={goNext}
            className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
          >
             ➡
          </button>
        )}
      </div>

      {/* Share Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowShare(!showShare)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-500"
        >
          🔗 Share
        </button>
      </div>

      {/* Iframe Embed Code */}
      {showShare && (
        <div className="mt-4 w-full max-w-xl bg-white p-4 rounded-lg shadow-md">
          <p className="font-semibold mb-2">Embed this flipbook:</p>
          <textarea
            readOnly
            value={iframeCode}
            className="w-full p-2 border rounded bg-gray-100 text-sm font-mono"
            rows="3"
            onClick={(e) => e.target.select()}
          />
          <p className="text-xs text-gray-500 mt-2">
            Copy this iframe code and paste it into any website.
          </p>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Fileviewer;
