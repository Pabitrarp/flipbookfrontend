import React, { useEffect, useState } from 'react'
import { Layout } from './Layout'
import { Sidebar } from './Sidebar'
import axios from 'axios';
import { Modal } from './Modal';
import { useContext } from 'react';
import { Templateurl } from '../context/Templateurl';
export const Templets = () => {
    const [templets, setTemplets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
  const [startFile, setStartFile] = useState(null);
  const [endFile, setEndFile] = useState(null);
const {templateurl,setTemplateurl}=useContext(Templateurl);
  const allowedTypes = ["image/jpeg", "image/png", ];

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && !allowedTypes.includes(file.type)) {
      setError(" Only JPEG, PNG, files are allowed.");
      e.target.value = ""; // reset invalid file
      setFile(null);
    } else {
      setError("");
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!startFile || !endFile) {
      setError("⚠️ Please upload both files before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("startCover", startFile);
      formData.append("endCover", endFile);

      // Send to backend API
      const res = await axios.post("http://flipbook.mitchell-railgear.com/api/multer/cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload success:", res.data);
      alert("Files uploaded successfully!");
    } catch (err) {
      console.error(" Upload failed:", err);
      setError("Something went wrong while uploading.");
    }
  };

 useEffect(() => {
  const fetchTemplets = async () => {
    try {
      const res = await axios.get("http://flipbook.mitchell-railgear.com/api/templates");
      

      setTemplets(res?.data?.corvers || []);
     
    } catch (error) {
      console.error("Error fetching templets data:", error);
      alert("Failed to fetch templets");
    }
  };
  fetchTemplets();
}, []);

const setauthurl=(url)=>{
   setTemplateurl({start:`http://flipbook.mitchell-railgear.com/${url.startCover}`,end:`http://flipbook.mitchell-railgear.com/${url.endCover}`});
    alert("Template selected successfully");
}

    return (
        <Layout>
            <div className='flex min-h-screen  bg-blue-50'>
                <Sidebar></Sidebar>
                <div className='flex-1 p-6 '>
                    <div className='w-full flex  justify-between '>
                        <h1 className="text-2xl font-semibold mb-6">📚 Available Templates</h1>
                        <button className="bg-blue-600 text-white px-5  rounded hover:bg-blue-700 transition cursor-pointer h-10" onClick={() => setIsModalOpen(true)}>+ Add a Template</button>
                    </div>
                    <div className='mt-6'>
                        {
                            templets?.length === 0 ? (
                                <p>No templates available.</p>
                            ) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6">
                                {templets.map((template) => (
                                    <div key={template._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                                        <img
                                            src={`http://flipbook.mitchell-railgear.com/${template?.startCover}`}
                                            alt={`Template ${template._id}`}
                                            className="w-full h-20 object-cover rounded mb-4"
                                        />

                                        <div className='flex justify-center'> <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-400 transition cursor-pointer text-md font-bold" onClick={()=>setauthurl(template)}>Use</button></div>
                                    </div>
                                ))}
                            </div>)
                        }
                    </div>
                </div>

            </div>
            <Modal IsOpen={isModalOpen} >
                <div className='w-full p-2 flex justify-end'>
                    <button className=' text-gray-600 hover:text-gray-800 font-bold text-2xl cursor-pointer' onClick={() => setIsModalOpen(false)}>X</button>
                </div>
                <h2 className="text-xl font-semibold mb-4 text-center">Add New Template</h2>
               <div className="flex flex-col items-center w-full border gap-10 p-10">
      {/* Start Cover Template */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-gray-700 font-medium">Start Cover Template</label>
        <input
          type="file"
          accept=".jpeg,.jpg,.png,.svg"
          onChange={(e) => handleFileChange(e, setStartFile)}
          className="border border-gray-300 rounded-lg p-2 
          file:mr-3 file:py-1 file:px-3 
          file:border-0 file:rounded-md 
          file:bg-blue-600 file:text-white 
          hover:file:bg-blue-700 cursor-pointer"
        />
      </div>

      {/* End Cover Template */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-gray-700 font-medium">End Cover Template</label>
        <input
          type="file"
          accept=".jpeg,.jpg,.png,.svg"
          onChange={(e) => handleFileChange(e, setEndFile)}
          className="border border-gray-300 rounded-lg p-2 
          file:mr-3 file:py-1 file:px-3 
          file:border-0 file:rounded-md 
          file:bg-green-600 file:text-white 
          hover:file:bg-green-700 cursor-pointer"
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Upload Files
      </button>
    </div>
            </Modal>
        </Layout>

    )
}
