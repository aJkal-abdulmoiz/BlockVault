import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the list of files from the backend
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/files/getfiles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFiles(res.data.files);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h1>Uploaded Files</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
