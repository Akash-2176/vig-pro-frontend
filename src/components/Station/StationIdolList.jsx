import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./StationIdolList.css";
import axios from "axios";
import { IdolPopup } from "../idolPopup/IdolPopup";
import EditPopup from "../EditForm/EditPopup";
import StatusBarList from "../stats/statustablelist/StatusBarList";
import API_BASE_URL from "../../../apiConfig";

function StationIdolList({ station, setStation }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [showIdolPopup, setShowIdolPopup] = useState(false);
  const [idolData, setIdolData] = useState(null);
  const [editIdolData, setEditIdolData] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    // No need to maintain a separate `tableData` state if `station.stationIdol` is updated directly
  }, [station]);

  const handleComplete = async (idol_id, event) => {
    event.stopPropagation();

    // Show confirmation dialog
    const confirmAction = window.confirm(
      "Are you sure you want to mark this idol as complete?"
    );
    if (!confirmAction) {
      return; // Exit the function if the user cancels the action
    }
    try {
      // Send the patch request to update the idol's status
      const response = await axios.patch(
        `${API_BASE_URL}/stations/${station.stationId}/idol/${idol_id}/immersed`
      );
      // Check if the request was successful
      console.log(response.data);

      if (response.status === 200) {
        // Update the station's idol data after a successful patch request
        const updatedIdols = station.stationIdol.map((item) => {
          if (item.idol_id === idol_id) {
            return { ...item, isImmersed: true }; // Update the isImmersed flag
          }
          return item;
        });

        // Update the station state with the new idols
        setStation((prevStation) => ({
          ...prevStation,
          stationIdol: updatedIdols,
        }));
      }
    } catch (error) {
      console.error("Failed to update idol status:", error);
    }
  };

  const handleEdit = async (idolData, event) => {
    event.stopPropagation();
    setEditIdolData(idolData);
    setShowEditPopup(true);
    // handleEditPopup();
  };

  const handleDelete = async (idol_id, event) => {
    event.stopPropagation();

    const confirmAction = window.confirm(
      `Are you sure you want to Delete this idol ${idol_id}?`
    );
    if (!confirmAction) {
      return; // Exit the function if the user cancels the action
    }
    try {
      // Send the patch request to update the idol's status
      const response = await axios.post(
        `http://localhost:3000/api/stations/${station.stationId}/${idol_id}/deleteIdol`
      );
      console.log(response.data);

      if (response.status === 200) {
        // Delete the station's idol data after a successful patch request
        setStation((prevStation) => ({
          ...prevStation,
          stationIdol: prevStation.stationIdol.filter(
            (item) => item.idol_id !== idol_id
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to delete idol status:", error);
    }
  };

  // const handleEditPopup = async (newIdolData) => {
  //   // Show confirmation dialog
  //   const confirmAction = window.confirm(
  //     "Are you sure you want to Edit this idol ?"
  //   );
  //   if (!confirmAction) {
  //     return; // Exit the function if the user cancels the action
  //   }
  //   try {
  //     // Send the patch request to update the idol's status
  //     const response = await axios.post(
  //       `http://localhost:3000/api/stations/${station.stationId}/idol/${idol_id}/immersed`,
  //       newIdolData
  //     );
  //     // Check if the request was successful
  //     console.log(response.data);

  //     if (response.status === 200) {
  //       // Update the station's idol data after a successful patch request
  //       const updatedIdols = station.stationIdol.map((item) => {
  //         if (item.idol_id === idol_id) {
  //           return { ...item, isImmersed: true }; // Update the isImmersed flag
  //         }
  //         return item;
  //       });

  //       // Update the station state with the new idols
  //       setStation((prevStation) => ({
  //         ...prevStation,
  //         stationIdol: updatedIdols,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Failed to update idol status:", error);
  //   }
  // };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const filteredData = station.stationIdol.filter((item) =>
    filterStatus === "all"
      ? true
      : filterStatus === "COMPLETE"
      ? item.isImmersed === true
      : item.isImmersed === false
  );

  const handleOpenIdolInfo = function (idol) {
    setIdolData(idol);
    setShowIdolPopup(true);
  };

  const handleCloseIdolPopup = function () {
    setShowIdolPopup(false);
  };

  // handle Open popup
  const handleCloseUpdatePopup = function () {
    setShowEditPopup(false);
  };

  const numberOfIdols = filteredData.length;
  const numberOfImmersedIdols = filteredData.filter(
    (e) => e.isImmersed === true
  ).length;
  const numberOfNonImmersedIdols = filteredData.filter(
    (e) => e.isImmersed === false
  ).length;
  const numberOfPrivateIdols = filteredData.filter(
    (e) => e.typeOfInstaller === "private"
  ).length;
  const numberOfPublicIdols = filteredData.filter(
    (e) => e.typeOfInstaller === "public"
  ).length;
  const numberOfOrganizationIdols = filteredData.filter(
    (e) => e.typeOfInstaller === "organization"
  ).length;
  const numberOfSensitiveIdols = filteredData.filter(
    (e) => e.sensitivity === "Sensitive"
  ).length;
  const numberOfNonSensitiveIdols = filteredData.filter(
    (e) => e.sensitivity === "Nonsensitive"
  ).length;
  const numberOfHyperSensitiveIdols = filteredData.filter(
    (e) => e.sensitivity === "Hyper-Sensitive"
  ).length;

  const StatusDataArray = [
    numberOfIdols,
    numberOfImmersedIdols,
    numberOfNonImmersedIdols,
    numberOfPrivateIdols,
    numberOfPublicIdols,
    numberOfOrganizationIdols,
    numberOfSensitiveIdols,
    numberOfNonSensitiveIdols,
    numberOfHyperSensitiveIdols,
  ];

  return (
    <div className="App">
      {showIdolPopup && (
        <div>
          <IdolPopup idolData={idolData} onClose={handleCloseIdolPopup} />
        </div>
      )}

      <div>
        <EditPopup
          idolData={editIdolData}
          onClose={handleCloseUpdatePopup}
          station={station}
          setStation={setStation}
          onShow={showEditPopup}
          // onEditForm={handleOpenUpdateForm}
          // onEditFile={handleOpenUpdateFile}
        />
      </div>

      <div
        className="station-filter-buttons row mx-0 mt-4 btn-group btn-group-toggle w-100"
        role="group"
        aria-label="Button group"
      >
        <div className="col-md-2 my-2">
          <input
            type="radio"
            className="btn-check"
            name="filter-button"
            id="filter-button1"
            autoComplete="off"
            defaultChecked
            onClick={() => handleFilter("all")}
          />
          <label
            className="btn btn-outline-primary border w-100 flex-fill"
            htmlFor="filter-button1"
          >
            All
          </label>
        </div>
        <div className="col-md-2 my-2">
          <input
            type="radio"
            className="btn-check"
            name="filter-button"
            id="filter-button2"
            autoComplete="off"
            onClick={() => handleFilter("COMPLETE")}
          />
          <label
            className="btn btn-outline-primary border w-100 flex-fill"
            htmlFor="filter-button2"
          >
            Immersion Complete
          </label>
        </div>
        <div className="col-md-2 my-2">
          <input
            type="radio"
            className="btn-check"
            name="filter-button"
            id="filter-button3"
            autoComplete="off"
            onClick={() => handleFilter("INCOMPLETE")}
          />
          <label
            className="btn btn-outline-primary border w-100 flex-fill"
            htmlFor="filter-button3"
          >
            Immersion Incomplete
          </label>
        </div>
      </div>
      <div className="tableDiv m-5 table-responsive-xxl">
        <table className="station-table-div table table-light table-striped table-hover table-bordered">
          <thead className="text-center align-middle">
            <tr className="text-center">
              <th>S.No</th>
              <th>Idol ID</th>
              <th>Location of Installation</th>
              <th>Place of Immersion</th>
              <th>Date of Immersion</th>
              <th>Type</th>
              <th>Sensitive</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {filteredData.map((item, index) => (
              <tr key={item.idol_id} onClick={() => handleOpenIdolInfo(item)}>
                <td>{index + 1}</td>
                <td>{item.idol_id}</td>
                <td>{item.placeOfInstallation}</td>
                <td>{item.placeOfImmersion}</td>
                <td>{new Date(item.immersionDate).toLocaleDateString()}</td>
                <td>{item.typeOfInstaller}</td>
                <td>{item.sensitivity}</td>
                <td>{item.isImmersed ? "Complete" : "Incomplete"}</td>
                <td className="d-flex align-items-center justify-content-center">
                  {item.isImmersed ? (
                    <span>Completed</span>
                  ) : (
                    <button
                      className="btn my-2 btn-warning"
                      onClick={(event) => handleComplete(item.idol_id, event)}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    className="btn my-2 btn-success mx-2"
                    onClick={(event) => handleEdit(item, event)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn my-2 btn-danger"
                    onClick={(event) => handleDelete(item.idol_id, event)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StationIdolList;
