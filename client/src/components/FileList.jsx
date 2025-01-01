import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreateSignedShareUrl } from '../utils/SignedShareLink'


const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState(''); // Set as a single string

  const handleGetFileShareLink = async (file) => {
    const cid = file.cid; // Use file.cid, not e.file.cid

    const signedUrl = await CreateSignedShareUrl(cid);
    setSignedUrl(signedUrl); // Update signedUrl state
  };



  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const username = localStorage.getItem('loggedInuser');
        const res = await axios.get('http://localhost:5000/api/files/getfiles', 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT Token
            'x-username': username,
          },
        }
      );
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
                {/* Display the signed URL if available */}
                

                

                <div className='lower-container'>
                {!signedUrl && <button onClick={() => handleGetFileShareLink(file)}>Get Share Link</button>}
                {signedUrl && <p className=''>URL: <a className='link' href={signedUrl} target="_blank" rel="noopener noreferrer">Limited Share Link</a></p>}
                <hr />
                <p>File Name: {file.fileName || 'Untitled'}</p>
                <p>Owner: {file.owner || 'Unknown'}</p>

                  View File
                </div>

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
