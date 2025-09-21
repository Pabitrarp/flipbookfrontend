import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Layout} from './Layout.jsx';
import { Sidebar } from './Sidebar.jsx';
import axios from 'axios';
export const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://flipbook.mitchell-railgear.com/api/multer/file', {
          method: 'GET',
        });
        const result = await res.json();
        setData(result.files || []);
      } catch (error) {
        console.log('Error fetching files:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenFlipbook = (fileId) => {
    navigate(`/flipbook/${fileId}`);
  };
const handledeleteFlipbook = async (fileId) => {
  try {
    const res = await axios.get(`http://flipbook.mitchell-railgear.com/api/multer/${fileId}`);
    if (res) {
      console.log(res);
      alert("File deleted successfully");
      setData(data.filter(file => file._id !== fileId));
    } else {
      const errorText = await res.text();
      console.error('Failed to delete file:', errorText);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};


  return (
    <Layout>
    <div className="min-h-screen bg-blue-50  flex">
      <Sidebar></Sidebar>
      <div className='flex-1 p-6 '>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📚 Flipbook Dashboard</h1>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create a Flipbook
        </Link>
      </div>
    <div className='w-full flex justify-center items-center  p-4'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[88%] ">
        {data.length > 0 ? (
          data.map((file) => (
            <div
              key={file._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h2 className="font-bold text-lg truncate">{file?.originalName}</h2>
              <p className="text-gray-600 text-sm mt-1">
                Uploaded: {new Date(file?.uploadedAt).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

              </p>
              <div className='flex gap-4'>
                <button
                onClick={() => handleOpenFlipbook(file._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                📖 Open Flipbook
              </button>
              <button
                onClick={() => handledeleteFlipbook(file._id)}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded  transition"
              >
                Delete
              </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No PDFs uploaded yet.</p>
        )}
      </div>
      </div>
      </div>
    </div>
    </Layout>
  );
};
