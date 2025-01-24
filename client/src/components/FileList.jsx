import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { grantAccess, revokeAccess, getFileCIDbyFId, hasAccess } from '../utils/ContractFunctions'; // Import contract functions
import { CreateSignedShareUrl } from '../utils/SignedShareLink'; // Import share link function

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFileCid, setSelectedFileCid] = useState(null);
  const [selectedFileCidReal, setSelectedFileCidReal] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [accessAddress, setAccessAddress] = useState('');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showhasAccess, setshowhasAccess] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [signedUrl, setSignedUrl] = useState('');

  const username = localStorage.getItem('loggedInuser');

  // Fetch files from the backend
  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/files/getfiles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'x-username': username,
        },
      });
      setFiles(res.data.files);
    } catch (err) {
      const serverError = err.response?.data?.message || 'Error fetching files';
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/files/deletefile',
        { cid: selectedFileCidReal, loggedInuser: username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Handle successful response if needed (e.g., update UI or state)
      alert(`File ${selectedFileName} deleted successfully.`);
      fetchFiles(); // Refresh the file list
    } catch (err) {
      console.error('Error deleting file:', err.response || 'Error deleting file');
      setError(err.response?.data?.message || 'Error deleting file');
    } finally {
      setLoading(false);
    }
  };

  // Handle file access control (granting access)
  const handleGrantAccess = async () => {
    if (selectedFileCid && accessAddress) {
      try {
        await grantAccess(selectedFileCid, accessAddress); // Pass CID and access address
        alert(`Access granted to ${accessAddress}`);
        setShowGrantModal(false); // Close modal after granting access
      } catch (error) {
        alert('Error granting access');
      }
    }
  };

  // Handle file access control (revoking access)
  const handleRevokeAccess = async () => {
    if (selectedFileCid && accessAddress) {
      try {
        await revokeAccess(selectedFileCid, accessAddress); // Pass CID and access address
        alert(`Access revoked from ${accessAddress}`);
        setShowRevokeModal(false); // Close modal after revoking access
      } catch (error) {
        alert('Error revoking access');
      }
    }
  };

  const handleCheckAccess = async () => {
    if (selectedFileCid && accessAddress) {
      try {
        const access = await hasAccess(selectedFileCid, accessAddress); // Pass CID and access address
        alert(`Access for wallet ${accessAddress} is ${access}`);
        setShowRevokeModal(false); // Close modal after revoking access
      } catch (error) {
        alert('Error Incorrect Wallet address');
      }
    }
  };

  // Fetch File CID from the blockchain
  const fetchFileCID = async () => {
    if (selectedFileCid) {
      const cid = await getFileCIDbyFId(selectedFileCid);
      console.log(cid);
      setMessage(`File CID: ${cid}`);
    }
  };

  // Handle the creation of the signed share URL
  const handleGetFileShareLink = async (file) => {
    const cid = file.cid; // Use file.cid, not e.file.cid
    const signedUrl = await CreateSignedShareUrl(cid);
    setSignedUrl(signedUrl); // Update signedUrl state
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="file-list-container">
      <h1>Uploaded Files</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="file-cards">
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file._id} className="file-card">
                <div className="file-header">
                  {!signedUrl && <button onClick={() => handleGetFileShareLink(file)}>Get Share Link</button>}
                  {signedUrl && (
                    <p className="link">
                      URL: <a style={{color: 'teal'}} href={signedUrl} target="_blank" rel="noopener noreferrer">Limited Share Link</a>
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSelectedFileCid(file.fileId);
                      setSelectedFileCidReal(file.cid);
                      setSelectedFileName(file.fileName);
                      setShowOptionsModal(true);
                    }}
                    className="dots-button"
                  >
                    ...
                  </button>
                </div>
                <div className="lower-container">
                  <hr />
                  <p><b>File Name:</b> {file.fileName || 'Untitled'}</p>
                  <p><b>Owner:</b> {file.owner || 'Unknown'}</p>
                  <p><b>File Block ID:</b> {file.fileId || 'Unknown'}</p>
                  {message && <b><p>{message}</p></b>}
                </div>

                {/* Show Options Modal only for the selected file */}
                {showOptionsModal && selectedFileCid === file.fileId && (
                  <div className="options-dropdown">
                    <button onClick={() => setShowOptionsModal(false)}>x</button>
                    <button onClick={() => setshowhasAccess(true)}>Check Access</button>
                    <button onClick={() => setShowGrantModal(true)}>Grant Access</button>
                    <button onClick={() => setShowRevokeModal(true)}>Revoke Access</button>
                    <button onClick={fetchFileCID}>Fetch File CID</button>
                    <button onClick={handleDelete}>Delete</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>
      )}

      {/* Modal for Grant Access */}
      {showGrantModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Grant Access</h3>
            <input
              type="text"
              value={accessAddress}
              onChange={(e) => setAccessAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
            <button onClick={handleGrantAccess}>Grant Access</button>
            <button onClick={() => setShowGrantModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for Revoke Access */}
      {showRevokeModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Revoke Access</h3>
            <input
              type="text"
              value={accessAddress}
              onChange={(e) => setAccessAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
            <button onClick={handleRevokeAccess}>Revoke Access</button>
            <button onClick={() => setShowRevokeModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      {/* Modal for Checking Access */}
      {showhasAccess && (
        <div className="modal">
          <div className="modal-content">
            <h3>Check a User's Wallet Access</h3>
            <input
              type="text"
              value={accessAddress}
              onChange={(e) => setAccessAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
            <button onClick={handleCheckAccess}>Check Access</button>
            <button onClick={() => setshowhasAccess(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
