import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import html2pdf from 'html2pdf.js';
import { PDFDocument } from 'pdf-lib';
import {Layout} from './Layout';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [content, setContent] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
const navigate = useNavigate();
  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: 'Start writing your content here...',
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageTags = files
      .map((file) => {
        const url = URL.createObjectURL(file);
        return `<img src="${url}" alt="Uploaded" style="width: 100%; margin-top: 10px;" />`;
      })
      .join('');
    setContent(prev => prev + imageTags);
  };

  const handlePdfUpload = (e) => {
    setPdfFiles(Array.from(e.target.files));
  };

  // Convert HTML to PDF blob
  const htmlToPdfBlob = async () => {
    const el = document.createElement('div');
    el.innerHTML = content;
    const opt = {
      margin: 1,
      filename: 'content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    const pdfBlob = await html2pdf().set(opt).from(el).outputPdf('blob');
    return pdfBlob;
  };

  const mergeAndShowFlipbook = async () => {
    const contentPdfBlob = await htmlToPdfBlob();
    const mergedPdf = await PDFDocument.create();

    const loadAndAppend = async (pdfBlob) => {
      const pdfBytes = await pdfBlob.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    };

  
    await loadAndAppend(contentPdfBlob);

    
    for (const file of pdfFiles) {
      await loadAndAppend(file);
    }

    const finalPdfBytes = await mergedPdf.save();
 const finalPdfBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('file', finalPdfBlob, 'flipbook.pdf');

  try {
    const response = await fetch('http://flipbook.mitchell-railgear.com/api/multer/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload PDF');
    }

    const result = await response.json();
    console.log('Upload success:', result); 
    alert('Flipbook created successfully!');
navigate("/");
  } catch (err) {
    console.error('Error uploading PDF:', err);
  }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-blue-50 gap-2">
    
      <div className="sidebar w-[30%]  p-4 shadow-md rounded-lg flex flex-col gap-4 bg-blue-50">
        <JoditEditor
          ref={editor}
          value={content}
           config={{
    ...config,
    height: 600, 
    minHeight:350 
  }}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          style={{ minHeight: '40vh' }}
        />

        <button
          onClick={() => setContent('')}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Clear Content
        </button>

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
          onClick={mergeAndShowFlipbook}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
        >
          Create Flipbook
        </button>
      </div>

      {/* Content Preview */}
      <div className="content w-full p-4 h-screen">
        <div className="mt-4 p-4 rounded h-[93vh] flex justify-center">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="w-96 rounded-md bg-white shadow-md p-4 overflow-y-auto"
          ></div>
        </div>
      </div>

    </div>
    </Layout>
  );
};

export default Homepage;
