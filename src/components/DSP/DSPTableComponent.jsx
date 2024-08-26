import React, { useState, useEffect } from "react";

const DSPTableComponent = ({ DSP }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");

  // Flatten the data structure and map relevant fields for easier filtering
  const data = DSP.stationIds.flatMap((station) =>
    station.stationIdol.map((idol) => ({
      ...idol,
      stationLocation: station.stationLocation, // Attach station location to each idol
    }))
  );

  // Extract unique immersion dates for the dropdown
  const allDates = [
    ...new Set(
      data.map((idol) => new Date(idol.immersionDate).toLocaleDateString())
    ),
  ];

  // Filter the data based on selected criteria
  const filteredData = data.filter((idol) => {
    const statusMatch =
      selectedStatus === "" ||
      (selectedStatus === "Completed" && idol.typeOfInstaller === "Immersed") || // Treat "Completed" as "Immersed"
      (selectedStatus !== "Completed" && idol.typeOfInstaller !== "Immersed");

    return (
      (selectedDate === "" ||
        new Date(idol.immersionDate).toLocaleDateString() === selectedDate) &&
      (selectedArea === "" || idol.stationLocation === selectedArea) &&
      statusMatch &&
      (selectedPlace === "" || idol.placeOfImmersion === selectedPlace)
    );
  });

  return (
    <div className="mx-5 my-2 viewDiv">
      {/* <p className="h1 text-center  mt-2 mb-3">{headerText} Station</p> */}
      <div className="btn-Div">
        <div className="row mb-5" id="dsp-filters">
          <div className="col-md-3 my-2">
            <label htmlFor="subPlaceSelect" className="me-sm-2 mb-2">
              Police Station :
            </label>
            <select
              id="subPlaceSelect"
              className="form-select"
              // value={selectedSubPlace}
              // onChange={handleSubPlaceChange}
            >
              <option value="">Select Police Station</option>
              {/* {stations.map((subPlace) => (
                <option key={subPlace} value={subPlace}>
                  {subPlace}
                </option>
              ))} */}
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="statusSelect" className="me-sm-2 mb-2">
              Status :
            </label>
            <select
              id="statusSelect"
              className="form-select"
              // value={statusFilter}
              // onChange={handleStatusFilter}
            >
              <option value="all">All</option>
              <option value="COMPLETE">Complete</option>
              <option value="INCOMPLETE">Incomplete</option>
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="typeSelect" className="me-sm-2 mb-2">
              Type :
            </label>
            <select
              id="typeSelect"
              className="form-select"
              // value={typeFilter}
              // onChange={handleTypeFilter}
            >
              <option value="all">All</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Organisation">Organisation</option>
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="dateInput" className="me-sm-2  mb-2">
              Date :
            </label>
            <input
              id="dateInput"
              type="date"
              className="form-control"
              // value={selectedDate}
              // onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      <div className="tableDiv table-responsive-lg m-5">
        <table className="table table-light table-striped table-hover">
          <thead>
            <tr>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                ID
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Idol ID
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Location of Installation
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Place of Immersion
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Type
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Date of immersion
              </th>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{index + 1}</td>
                <td style={{ padding: "8px" }}>{item.idol_id}</td>
                <td style={{ padding: "8px" }}>{item.hamletVillage}</td>
                <td style={{ padding: "8px" }}>{item.placeOfImmersion}</td>
                <td style={{ padding: "8px" }}>{item.property.type}</td>
                <td style={{ padding: "8px" }}>{item.setupDate}</td>
                <td style={{ padding: "8px" }}>
                  {item.isImmersed ? "COMPLETED" : "INCOMPLETE"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DSPTableComponent;
