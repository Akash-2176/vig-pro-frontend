import { useState } from "react";
import { IdolPopup } from "../idolPopup/idolPopup";
import StatusBarList from "../stats/statustablelist/StatusBarList";

function SPTableComponent({ SP }) {
  console.log(SP);

  const [showIdolPopup, setShowIdolPopup] = useState(false);
  const [idolData, setIdolData] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSensitive, setSelectedSensitive] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleDivisionSelect = (event) => {
    setSelectedDivision(event.target.value);
  };

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

  // Get all idols
  const SPgetALLStationIdol = function (SPdata) {
    return SPdata.dspIds.flatMap((dsp) =>
      dsp.stationIds.flatMap((station) =>
        station.stationIdol.map((idol) => ({
          idol: idol,
          // stationLocation: station.stationLocation,
          // stationDivision: station.stationDivision,
        }))
      )
    );
  };

  // console.log(

  // );

  // const DSPgetAllStationIdol = function (DSPdata) {
  //   return DSPdata.stationIds.flatMap((station) =>
  //     station.stationIdol.map((idol) => ({
  //       ...idol,
  //       stationLocation: station.stationLocation, // Attach station location to each idol
  //     }))
  //   );
  // };

  // const allIdols = SPgetALLStationIdol(SP);

  let filteredData = SP.dspIds.flatMap((dsp) =>
    dsp.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
        stationLocation: station.stationLocation,
        stationDivision: station.stationDivision,
      }))
    )
  );

  console.log(filteredData);

  let station = SP.dspIds.flatMap((dsp) => dsp.stationIds);
  let Dates = filteredData.map(
    (e) =>
      e.immersionDate && new Date(e.immersionDate).toISOString().split("T")[0]
  );
  const dates = Dates.filter((value, index) => Dates.indexOf(value) === index);

  let StationDivision = filteredData.map((e) => e.stationDivision);

  const stationDivisions = StationDivision.filter(
    (value, index) => StationDivision.indexOf(value) === index
  );

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
    const stationDiviosionMatch =
      !selectedDivision || item.stationDivision === selectedDivision;

    console.log(item.stationLocation);

    return (
      typeMatch &&
      sensitiveMatch &&
      statusMatch &&
      dateMatch &&
      policeStationMatch &&
      stationDiviosionMatch
    );
  });

  const handleOpenIdolInfo = (idol) => {
    setIdolData(idol);
    setShowIdolPopup(true);
  };

  const handleCloseIdolPopup = () => {
    setShowIdolPopup(false);
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
  console.log(filteredData);

  return (
    <div className="mx-5 my-2 viewDiv">
      <StatusBarList data={StatusDataArray} />
      {showIdolPopup && (
        <div>
          <IdolPopup idolData={idolData} onClose={handleCloseIdolPopup} />
        </div>
      )}
      <p className="h1 text-center mb-3"> Station</p>
      <div className="row mb-5" id="sp-filters">
        <div className="col-lg-3 my-2">
          <label htmlFor="divisionSelect" className="me-sm-2 mb-2">
            Sub Division
          </label>
          <select
            id="divisionSelect"
            className="form-select"
            value={selectedDivision}
            onChange={handleDivisionSelect}
          >
            <option value="">All Divisions</option>
            {stationDivisions.map((policeStation) => (
              <option key={policeStation} value={policeStation}>
                {policeStation}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-3 my-2">
          <label htmlFor="subPlaceSelect" className="me-sm-2 mb-2">
            Police Station :
          </label>
          <select
            id="subPlaceSelect"
            className="form-select"
            value={selectedPoliceStation}
            onChange={handlePoliceStationSelect}
          >
            <option value="">All Police Station</option>
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
        <div className="col-lg-3 my-2">
          <label htmlFor="typeSelect" className="me-sm-2 mb-2">
            Type :
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
        <div className="col-lg-3 my-2">
          <label htmlFor="statusSelect" className="me-sm-2 mb-2">
            Status :
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

        <div className="col-lg-3 my-2">
          <label htmlFor="dateInput" className="me-sm-2 mb-2">
            Date :
          </label>
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
      <div className="table-responsive-lg">
        <table className="table sp-table table-light table-striped table-hover">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Idol ID</th>
              <th> Location of Installation</th>
              <th>Place of Immersion</th>
              <th> Date of Immersion</th>
              <th> Type</th>
              <th>Sensitive</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id} onClick={() => handleOpenIdolInfo(item)}>
                  <td>{index + 1}</td>
                  <td>{item.idol_id}</td>
                  <td>{item.placeOfInstallation}</td>
                  <td>{item.placeOfImmersion}</td>
                  <td>{new Date(item.setupDate).toLocaleDateString()}</td>
                  <td>{item.typeOfInstaller}</td>
                  <td>{item.sensitivity}</td>
                  <td>{item.isImmersed ? "Complete" : "Incomplete"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="fs-3 py-3" colSpan={"7"}>
                  No idols available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SPTableComponent;
