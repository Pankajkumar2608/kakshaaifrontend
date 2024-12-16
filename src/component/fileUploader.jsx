import React, { useRef } from "react";

const FileUploader = ({ onFileUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    onFileUpload(uploadedFile);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
      >
        Upload File
      </button>
    </div>
  );
};

export default FileUploader;
