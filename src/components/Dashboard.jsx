import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/multer/file', {
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

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📚 Flipbook Dashboard</h1>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create a Flipbook
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <button
                onClick={() => handleOpenFlipbook(file._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                📖 Open Flipbook
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No PDFs uploaded yet.</p>
        )}
      </div>
    </div>
  );
};
