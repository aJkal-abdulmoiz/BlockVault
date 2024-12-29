import React from 'react';

const FileList = ({ files }) => {
  return (
    <div className="file-list">
      {files.length > 0 ? (
        files.map((file) => (
          <div key={file._id} className="file-item">
            <p>{file.name}</p>
            <a href={`https://ipfs.io/ipfs/${file.hash}`} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
        ))
      ) : (
        <p>No files uploaded yet</p>
      )}
    </div>
  );
};

export default FileList;
