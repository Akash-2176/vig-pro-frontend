import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form_Style.css";
import "./editfiles_style.css";
import EditSingleFile from "./EditSingleFile"; // Import the single file editor
import noImage from "/noimage.jpg";

const EditFiles = ({ onClose, idolData, station, setStation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(""); // Track type of file being updated (applicantImage or idolImage)
  const [url, setUrl] = useState("");
  const [showEditFileModal, setShowEditFileModal] = useState(false);

  const handleEditClick = (type, urlData) => {
    setFileType(type);
    setUrl(urlData);
    setShowEditFileModal(true);
  };

  const handleIdolUpdate = (updatedIdol) => {
    setStation((prevStation) => {
      const updatedIdols = prevStation.stationIdol.map((idol) =>
        idol.idol_id === updatedIdol.idol_id ? updatedIdol : idol
      );

      return { ...prevStation, stationIdol: updatedIdols };
    });
    setShowEditFileModal(false);
  };

  return (
    <div className="main my-5">
      <div className="form-container">
        <div className="form__close__btn btn" onClick={onClose}>
          &times;
        </div>
        <h5>Edit files</h5>
        <div className="d-flex justify-content-between align-item-stretch">
          <div className="card">
            <h6 className="text-center h5">Applicant Image</h6>
            <img
              src={idolData.applicantImage ? idolData.applicantImage : noImage}
              alt=""
              className="showedit__img my-3"
            />
            <button
              className="btn btn-primary"
              onClick={() =>
                handleEditClick("applicantImage", "uploadApplicantImage")
              }
            >
              {idolData.applicantImage ? "Edit Image" : "Add Image"}
            </button>
          </div>

          <div className="card">
            <h6 className="text-center h5">Idol Image</h6>
            <img
              src={idolData.idolImage ? idolData.idolImage : noImage}
              alt=""
              className="showedit__img my-3"
            />
            <button
              className="btn btn-primary"
              onClick={() => handleEditClick("idolImage", "uploadImage")}
            >
              {idolData.idolImage ? "Edit Image" : "Add Image"}
            </button>
          </div>

          <div className="card d-flex">
            <h6 className="text-center h5">Idol Application</h6>

            <a href={idolData.idolApplication} target="_blank">
              <button className="btn btn-dark">
                {" "}
                {idolData.idolApplication
                  ? "View Application"
                  : "No Application"}
              </button>
            </a>
            <button
              className="btn btn-primary p-2"
              onClick={() => handleEditClick("idolApplication")}
            >
              {idolData.idolApplication ? "Edit Pdf" : "Add Pdf"}
            </button>
          </div>
        </div>

        {showEditFileModal && (
          <EditSingleFile
            url={`/stations/${station.stationId}/${idolData.idol_id}/${url}`}
            uploadName={fileType}
            displayName={
              fileType === "applicantImage"
                ? "Applicant Image"
                : fileType === "idolImage"
                ? "Idol Image"
                : "Application"
            }
            onClose={() => setShowEditFileModal(false)}
            setStation={setStation}
            onIdolUpdate={handleIdolUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default EditFiles;
