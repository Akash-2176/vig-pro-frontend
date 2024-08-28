import React, { useState } from "react";
import { IdolPopup } from "../idolPopup/idolPopup";

const DSPTableComponent = ({ DSP }) => {
  const [showIdolPopup, setShowIdolPopup] = useState(false);
  const [idolData, setIdolData] = useState(null);

  const [selectedPoliceStation, setSelectedPoliceStation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSensitive, setSelectedSensitive] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handlePoliceStationSelect = (event) => {
    setSelectedPoliceStation(event.target.value);
  };

  const handleTypeSelect = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSensitiveSelect = (event) => {
    setSelectedSensitive(event.target.value);
  };

  const handleStatusSelect = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDateSelect = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const DSPgetAllStationIdol = (DSPdata) => {
    console.log(DSPdata.stationIds);

    return DSPdata.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
        stationLocation: station.stationLocation,
      }))
    );
  };

  // Flatten the data structure and map relevant fields for easier filtering
  let filteredData = DSPgetAllStationIdol(DSP);

  const station = DSP.stationIds;
  let Dates = filteredData.map((e) => {
    // console.log(e.immersionDate);

    new Date(e.immersionDate).toISOString().split("T")[0];
  });
  const dates = Dates.filter((value, index) => Dates.indexOf(value) === index);

  filteredData = filteredData.filter((item) => {
    console.log(selectedType);

    const typeMatch = !selectedType || item.typeOfInstaller === selectedType;

    const sensitiveMatch =
      !selectedSensitive || item.sensitivity === selectedSensitive;
    const statusMatch =
      !selectedStatus ||
      (selectedStatus === "Complete" && item.isImmersed) ||
      (selectedStatus === "Incomplete" && !item.isImmersed);
    const dateMatch =
      !selectedDate || dates.find((e) => e === selectedDate) === selectedDate;
    const policeStationMatch =
      !selectedPoliceStation || item.stationLocation === selectedPoliceStation;

    console.log(item.stationLocation);

    return (
      typeMatch &&
      sensitiveMatch &&
      statusMatch &&
      dateMatch &&
      policeStationMatch
    );
  });

  console.log(filteredData);

  const handleOpenIdolInfo = (idol) => {
    setIdolData(idol);
    setShowIdolPopup(true);
  };

  const handleCloseIdolPopup = () => {
    setShowIdolPopup(false);
  };

  return (
    <div className="mx-5 my-2 viewDiv">
      {showIdolPopup && (
        <IdolPopup idolData={idolData} onClose={handleCloseIdolPopup} />
      )}
      <div className="btn-Div">
        <div className="row mb-5" id="dsp-filters">
          <div className="col-lg-3 my-2">
            <label htmlFor="subPlaceSelect" className="me-sm-2 mb-2">
              Police Station:
            </label>
            <select
              id="subPlaceSelect"
              className="form-select"
              value={selectedPoliceStation}
              onChange={handlePoliceStationSelect}
            >
              <option value="">Select Police Station</option>
              {station.map((policeStation) => (
                <option
                  key={policeStation.stationLocation}
                  value={policeStation.stationLocation}
                >
                  {policeStation.stationLocation}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="typeSelect" className="me-sm-2 mb-2">
              Type:
            </label>
            <select
              id="typeSelect"
              className="form-select"
              value={selectedType}
              onChange={handleTypeSelect}
            >
              <option value="">All</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="organisation">Organisation</option>
            </select>
          </div>

          <div className="col-lg-3 my-2">
            <label htmlFor="sensitiveSelect" className="me-sm-2 mb-2">
              Sensitivity:
            </label>
            <select
              className="form-select"
              onChange={handleSensitiveSelect}
              id="sensitivity"
              value={selectedSensitive}
              name="sensitivity"
            >
              <option value="">Select Option</option>
              <option value="Insensitive">Insensitive</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Hyper-Sensitive">Hyper-Sensitive</option>
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="statusSelect" className="me-sm-2 mb-2">
              Status:
            </label>
            <select
              id="statusSelect"
              className="form-select"
              value={selectedStatus}
              onChange={handleStatusSelect}
            >
              <option value="">All</option>
              <option value="Complete">Complete</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>

          <div className="col-lg-2 my-2">
            <label htmlFor="dateInput" className="me-sm-2 mb-2">
              Date:
            </label>
            {/* <input
              id="dateInput"
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleDateSelect}
            /> */}
            <select
              id="dateInput"
              className="form-select"
              value={selectedDate}
              onChange={handleDateSelect}
            >
              <option value="">Select date</option>
              {dates.map((el, index) => (
                <option key={index} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tableDiv table-responsive-lg my-5">
        <table className="table dsp-table table-light table-striped table-hover">
          <thead>
            <tr>
              <th
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                S.No
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
                Date of Immersion
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
                Sensitive
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
              <tr
                key={index}
                style={{ borderBottom: "1px solid #ddd" }}
                onClick={() => handleOpenIdolInfo(item)}
              >
                <td>{index + 1}</td>
                <td>{item.idol_id}</td>
                <td>{item.placeOfInstallation}</td>
                <td>{item.placeOfImmersion}</td>
                <td>{new Date(item.setupDate).toLocaleDateString()}</td>
                <td>{item.typeOfInstaller}</td>
                <td>{item.sensitivity}</td>
                <td>{item.isImmersed ? "Complete" : "Incomplete"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DSPTableComponent;
