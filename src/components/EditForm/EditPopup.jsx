import React, { useState } from "react";
import EditForm from "./EditForm";
import EditFiles from "./EditFiles";
import "./EditPopup.css";

const EditPopup = ({ onClose, idolData, station, setStation, onShow }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditFiles, setShowEditFiles] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showUpdateFile, setShowUpdateFile] = useState(false);
  const [editIdolData, setEditIdolData] = useState(null);
  // handle Open editform
  const handleOpenUpdateForm = function () {
    setEditIdolData(idolData);
    setShowUpdateForm(true);
    onClose();
  };

  const handleCloseUpdateForm = function () {
    setShowUpdateForm(false);
  };

  // handle open editfile
  const handleOpenUpdateFile = function () {
    setEditIdolData(idolData);
    setShowUpdateFile(true);
    onClose();
  };

  const handleCloseUpdateFile = function () {
    setShowUpdateFile(false);
  };

  return (
    <>
      {onShow && (
        <div>
          {/* {!(showEditFiles || showEditForm) && ( */}
          <div className="main    edit__form__container__popup">
            {/* {showLoading && <Loading />} */}
            <div className="form-container edit__form__popup__box">
              <div className="form__close__btn btn" onClick={onClose}>
                &times;
              </div>
              <div className="logo-container">
                <p className="h1 text-center">Edit Idol Details</p>
              </div>
              <div className="d-flex align-items-center justify-content-around g-2">
                <button
                  className="form-submit-btn prevBtn"
                  type="next"
                  // onClick={() => setShowEditForm(!showEditForm)}
                  onClick={() => handleOpenUpdateForm(idolData)}
                >
                  Edit Form Details
                </button>
                <button
                  className="form-submit-btn nextBtn"
                  type="next"
                  // onClick={() => setShowEditFiles(!showEditFiles)}
                  onClick={() => handleOpenUpdateFile(idolData)}
                >
                  Edit Form Images
                </button>
              </div>
            </div>
          </div>
          {/* )} */}
          {/* {showEditForm && <EditForm onback={() => setShowEditForm(false)} />}
      {showEditFiles && <EditFiles onback={() => setShowEditFiles(false)} />} */}
        </div>
      )}
      {showUpdateForm && (
        <div
          className="addIdol__station"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            minHeight: "100%",
            margin: "0 auto",
            width: "100vw",
            background: "#77777777",
            zIndex: 5,
          }}
        >
          <EditForm
            idolData={editIdolData}
            onClose={handleCloseUpdateForm}
            station={station}
            setStation={setStation}
          />
        </div>
      )}
      {showUpdateFile && (
        <div
          className="addIdol__station"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            minHeight: "100%",
            margin: "0 auto",
            width: "100vw",
            background: "#77777777",
            zIndex: 5,
          }}
        >
          <EditFiles
            idolData={editIdolData}
            onClose={handleCloseUpdateFile}
            station={station}
            setStation={setStation}
          />
        </div>
      )}
    </>
  );
};

export default EditPopup;
