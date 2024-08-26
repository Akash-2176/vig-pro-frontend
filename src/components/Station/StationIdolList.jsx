import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./StationIdolList.css";
import axios from "axios";
import { IdolPopup } from "../idolPopup/idolPopup";

function StationIdolList({ station, setStation }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [showIdolPopup, setShowIdolPopup] = useState(false);
  const [idolData, setIdolData] = useState(null);
  useEffect(() => {
    // No need to maintain a separate `tableData` state if `station.stationIdol` is updated directly
  }, [station]);

  const handleComplete = async (idol_id) => {
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
        `http://localhost:3000/api/stations/${station.stationId}/idol/${idol_id}/immersed`
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

  return (
    <div className="App">
      {showIdolPopup && (
        <div>
          <IdolPopup idolData={idolData} onClose={handleCloseIdolPopup} />
        </div>
      )}
      <div
        className="filter-buttons row m-5 btn-group btn-group-toggle w-100"
        role="group"
        aria-label="Button group"
      >
        <div className="col-sm-2 my-2">
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
            className="btn btn-outline-success w-100 flex-fill"
            htmlFor="filter-button1"
          >
            All
          </label>
        </div>
        <div className="col-sm-2 my-2">
          <input
            type="radio"
            className="btn-check"
            name="filter-button"
            id="filter-button2"
            autoComplete="off"
            onClick={() => handleFilter("COMPLETE")}
          />
          <label
            className="btn btn-outline-success w-100 flex-fill"
            htmlFor="filter-button2"
          >
            Complete
          </label>
        </div>
        <div className="col-sm-2 my-2">
          <input
            type="radio"
            className="btn-check"
            name="filter-button"
            id="filter-button3"
            autoComplete="off"
            onClick={() => handleFilter("INCOMPLETE")}
          />
          <label
            className="btn btn-outline-success w-100 flex-fill"
            htmlFor="filter-button3"
          >
            Incomplete
          </label>
        </div>
      </div>

      <div className="tableDiv m-5">
        <table className="table table-light table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Idol ID</th>
              <th>Location of installation</th>
              <th>Place of immersion</th>
              <th>Setup Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.idol_id} onClick={() => handleOpenIdolInfo(item)}>
                <td>{item.idol_id}</td>
                <td>{item.placeOfInstallation}</td>
                <td>{item.placeOfImmersion}</td>
                <td>{new Date(item.setupDate).toLocaleDateString()}</td>
                <td>{item.isImmersed ? "Complete" : "Incomplete"}</td>
                <td>
                  {item.isImmersed ? (
                    <span>Completed</span>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleComplete(item.idol_id)}
                    >
                      Complete
                    </button>
                  )}
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
