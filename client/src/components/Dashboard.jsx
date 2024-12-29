import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileList from './FileList';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/files', {
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

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <FileList files={files} />
      )}
      <button onClick={fetchFiles} disabled={loading}>
        Retry
      </button>
    </div>
  );
};

export default Dashboard;
