import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="file-list-container">
      <h1>Uploaded Files</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-cards">
          {files.length > 0 ? (
            files.map((file) => (
              <div className="file-card" key={file._id}>
                <h2>Owner: {file.owner || 'Unknown'}</h2>
                <p>File Name: {file.fileName || 'Untitled'}</p>
                <a
                  href={`https://olive-active-aardvark-146.mypinata.cloud/files/${file.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  View File
                </a>
              </div>
            ))
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileList;
