import React, { useState, useEffect } from "react";
import { IdolPopup } from "../idolPopup/IdolPopup";
import StatusBarList from "../stats/statustablelist/StatusBarList";

const DSPTableComponent = ({ DSP }) => {
  const [showIdolPopup, setShowIdolPopup] = useState(false);
  const [idolData, setIdolData] = useState(null);

  const [selectedPoliceStation, setSelectedPoliceStation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSensitive, setSelectedSensitive] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [filters, setFilters] = useState({
    stationLocation: "",
    type: "",
    sensitivity: "",
    dateOfImmersion: "",
    organizationName: "",
    immpersionState: "",
  });

  // const handlePoliceStationSelect = (event) => {
  //   setSelectedPoliceStation(event.target.value);
  // };

  // const handleTypeSelect = (event) => {
  //   setSelectedType(event.target.value);
  // };

  // const handleSensitiveSelect = (event) => {
  //   setSelectedSensitive(event.target.value);
  // };

  // const handleStatusSelect = (event) => {
  //   setSelectedStatus(event.target.value);
  // };

  // const handleDateSelect = (event) => {
  //   const selectedDate = event.target.value;
  //   setSelectedDate(selectedDate);
  // };

  const DSPgetAllStationIdol = (DSPdata) => {
    console.log(DSPdata.stationIds);

    return DSPdata.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
      }))
    );
  };

  // Flatten the data structure and map relevant fields for easier filtering
  let allIdols = DSPgetAllStationIdol(DSP);

  // const station = DSP.stationIds;
  // let Dates = filteredData.map((e) => {
  //   // console.log(e.immersionDate);

  //   new Date(e.immersionDate).toISOString().split("T")[0];
  // });
  // const dates = Dates.filter((value, index) => Dates.indexOf(value) === index);

  // filteredData = filteredData.filter((item) => {
  //   console.log(selectedType);

  //   const typeMatch = !selectedType || item.typeOfInstaller === selectedType;

  //   const sensitiveMatch =
  //     !selectedSensitive || item.sensitivity === selectedSensitive;
  //   const statusMatch =
  //     !selectedStatus ||
  //     (selectedStatus === "Complete" && item.isImmersed) ||
  //     (selectedStatus === "Incomplete" && !item.isImmersed);
  //   const dateMatch =
  //     !selectedDate || dates.find((e) => e === selectedDate) === selectedDate;
  //   const policeStationMatch =
  //     !selectedPoliceStation || item.stationLocation === selectedPoliceStation;

  //   console.log(item.stationLocation);

  //   return (
  //     typeMatch &&
  //     sensitiveMatch &&
  //     statusMatch &&
  //     dateMatch &&
  //     policeStationMatch
  //   );
  // });

  useEffect(() => {
    if (filters.type != "organization") {
      setFilters((prevFilters) => ({ ...prevFilters, organizationName: "" }));
    }
  }, [filters.type]);

  let filteredData = allIdols.filter((data) => {
    const matchesStation = filters.stationLocation
      ? data.stationName === filters.stationLocation
      : true;
    const matchesType = filters.type
      ? data.typeOfInstaller === filters.type
      : true;
    const matchesSensitivity = filters.sensitivity
      ? data.sensitivity === filters.sensitivity
      : true;
    const matchesDate = filters.dateOfImmersion
      ? new Date(data.immersionDate).toLocaleDateString() ===
        filters.dateOfImmersion
      : true;
    const matchesOrganization = filters.organizationName
      ? data.organizationName === filters.organizationName
      : true;

    const filterStatus = data.isImmersed === true ? "Complete" : "Incomplete";
    const matchesStatus = filters.immpersionState
      ? filterStatus === filters.immpersionState
      : true;

    return (
      matchesType &&
      matchesSensitivity &&
      matchesDate &&
      matchesOrganization &&
      matchesStation &&
      matchesStatus
    );
  });

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

  console.log(filteredData);

  const handleOpenIdolInfo = (idol) => {
    setIdolData(idol);
    setShowIdolPopup(true);
  };

  const handleCloseIdolPopup = () => {
    setShowIdolPopup(false);
  };
  const uniqueDates = [
    ...new Set(
      allIdols.map((idol) => new Date(idol.immersionDate).toLocaleDateString())
    ),
  ];
  return (
    <div className="mx-5 my-2 viewDiv">
      <StatusBarList data={StatusDataArray} />
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
              value={filters.stationLocation}
              onChange={(e) =>
                setFilters(() => ({
                  ...filters,
                  stationLocation: e.target.value,
                }))
              }
            >
              <option value="">Select Police Station</option>
              {DSP.stationIds.map((station, i) => (
                <option key={i} value={station.stationLocation}>
                  {station.stationLocation}
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
              value={filters.type}
              onChange={(e) =>
                setFilters(() => ({ ...filters, type: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          <div className="col-lg-2 my-2">
            <label htmlFor="organizationSelect" className="me-sm-2 mb-2">
              Organization :
            </label>
            <select
              id="organizationSelect"
              className="form-select"
              value={filters.organizationName}
              onChange={(e) =>
                setFilters(() => ({
                  ...filters,
                  organizationName: e.target.value,
                }))
              }
            >
              <option value="">Select Organization</option>
              {DSP.stationIds[0].defaultOrganization &&
                DSP.stationIds[0].defaultOrganization.map((org) => (
                  <option key={org}>{org}</option>
                ))}
            </select>
          </div>
          <div className="col-lg-3 my-2">
            <label htmlFor="sensitiveSelect" className="me-sm-2 mb-2">
              Sensitivity:
            </label>
            <select
              className="form-select"
              id="sensitivity"
              name="sensitivity"
              value={filters.sensitivity}
              onChange={(e) =>
                setFilters(() => ({ ...filters, sensitivity: e.target.value }))
              }
            >
              <option value="">Select Option</option>
              <option value="Nonsensitive">Nonsensitive</option>
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
              value={filters.immpersionState}
              onChange={(e) =>
                setFilters(() => ({
                  ...filters,
                  immpersionState: e.target.value,
                }))
              }
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
              value={filters.dateOfImmersion}
              onChange={(e) =>
                setFilters(() => ({
                  ...filters,
                  dateOfImmersion: e.target.value,
                }))
              }
            >
              <option value="">Select date</option>
              {uniqueDates.map((date, i) => (
                <option value={date} key={i}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tableDiv table-responsive-xxl my-5">
        <table className="table dsp-table table-light table-striped table-hover">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Idol ID</th>
              <th>Location of Installation</th>
              <th>Place of Immersion</th>
              <th>Date of Immersion</th>
              <th>Type</th>
              <th>Sensitive</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid #ddd" }}
                  onClick={() => handleOpenIdolInfo(item)}
                >
                  <td>{index + 1}</td>
                  <td>{item.idol_id}</td>
                  <td>{item.placeOfInstallation}</td>
                  <td>{item.placeOfImmersion}</td>
                  <td>{new Date(item.immersionDate).toLocaleDateString()}</td>
                  <td>{item.typeOfInstaller}</td>
                  <td>{item.sensitivity}</td>
                  <td>{item.isImmersed ? "Complete" : "Incomplete"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="fs-3 py-3" colSpan={"8"}>
                  No idols available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DSPTableComponent;
