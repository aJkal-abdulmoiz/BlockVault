import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileList from './FileList';
import { grantAccess, revokeAccess, getFileCID } from '../utils/ContractFunctions';  // Import blockchain interaction functions

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);  // Track selected file ID for access control
  const [accessAddress, setAccessAddress] = useState('');       // Track wallet address for granting/revoking access

  // Fetch files from the backend
  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/files/getfiles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token for authentication
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

  // Handle file access control (granting access)
  const handleGrantAccess = async () => {
    if (selectedFileId && accessAddress) {
      try {
        await grantAccess(selectedFileId, accessAddress);
        alert(`Access granted to ${accessAddress}`);
      } catch (error) {
        alert('Error granting access');
      }
    }
  };

  // Handle file access control (revoking access)
  const handleRevokeAccess = async () => {
    if (selectedFileId && accessAddress) {
      try {
        await revokeAccess(selectedFileId, accessAddress);
        alert(`Access revoked from ${accessAddress}`);
      } catch (error) {
        alert('Error revoking access');
      }
    }
  };

  // Fetch File CID from the blockchain
  const fetchFileCID = async () => {
    if (selectedFileId) {
      const cid = await getFileCID(selectedFileId);
      console.log('File CID:', cid);  // You can use the CID for further processing (e.g., display download link)
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Loading state */}
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <>
          {/* Display file list */}
          <FileList files={files} setSelectedFileId={setSelectedFileId} />

          {/* Handle file access */}
          {selectedFileId && (
            <div className="access-control">
              <h3>Manage Access for File {selectedFileId}</h3>
              <input
                type="text"
                value={accessAddress}
                onChange={(e) => setAccessAddress(e.target.value)}
                placeholder="Enter wallet address"
              />
              <button onClick={handleGrantAccess} disabled={loading}>Grant Access</button>
              <button onClick={handleRevokeAccess} disabled={loading}>Revoke Access</button>
              <button onClick={fetchFileCID} disabled={loading}>Fetch File CID</button>
            </div>
          )}
        </>
      )}
      
      {/* Retry button for fetching files */}
      <button onClick={fetchFiles} disabled={loading}>
        Retry
      </button>
    </div>
  );
};

export default Dashboard;
