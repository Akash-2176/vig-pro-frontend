import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../apiConfig";
import "./EditSingleFile_style.css";

export default function EditSingleFile({
  url,
  uploadName,
  displayName,
  onClose,
  onIdolUpdate, // New prop to handle idol update
}) {
  const [uploadfile, setUploadfile] = useState(null);
  const [message, setMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadfile) {
      setMessage("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append(uploadName, uploadfile);

    setShowLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("File uploaded successfully!");

      const updatedIdol = response.data.idol;
      onIdolUpdate(updatedIdol); // Pass the updated idol object to parent

      console.log(updatedIdol);
      setTimeout(onClose, 2000); // Close modal after successful upload
    } catch (error) {
      setMessage("Error uploading file.");
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="singlefile__container__background">
      <div className="singlefile__upload__container">
        <div className="form-container">
          <div className="form__close__btn btn" onClick={onClose}>
            &times;
          </div>
          <form onSubmit={handleFileUpload}>
            <h5>Upload {displayName}</h5>
            <input
              type="file"
              name={uploadName}
              className="form-control"
              onChange={(e) => setUploadfile(e.target.files[0])}
            />
            {uploadfile && (
              <div>
                <p>Selected file: {uploadfile.name}</p>
                <p>File type: {uploadfile.type}</p>
                <p>File size: {(uploadfile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
            <button className="btn btn-primary mt-3" type="submit">
              {showLoading ? "Uploading..." : "Submit"}
            </button>
            <p>{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
