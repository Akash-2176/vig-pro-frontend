import { useState } from "react";

function SPTableComponent({ SP }) {
  console.log(SP);

  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedSubPlace, setSelectedSubPlace] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Get all idols
  const SPgetALLStationIdol = function (SPdata) {
    return SPdata.dspIds.flatMap((dsp) =>
      dsp.stationIds.flatMap((station) => station.stationIdol)
    );
  };

  const DSPgetALLStationIdol = function (DSPdata) {
    return subdiv.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
        stationLocation: station.stationLocation, // Attach station location to each idol
      }))
    );
  };

  const allIdols = SPgetALLStationIdol(SP);
  let filteredData = [];
  let subdiv = [];
  if (selectedPlace === "" && selectedSubPlace === "") filteredData = allIdols;
  if (selectedPlace) {
    if (selectedSubPlace === "") {
      subdiv = SP.dspIds.find((dsp) => dsp.dspDivision === selectedPlace);
      filteredData = DSPgetALLStationIdol(subdiv);
      console.log("subdiv", subdiv);
    } else {
      console.log("subdiv", subdiv);
      const station = subdiv.stationIds.find((station) => {
        station.stationLocation === selectedSubPlace;
      });
      filteredData = station.stationIdol;
    }
  }

  if (statusFilter == "Complete")
    filteredData = filteredData.map((data) => data.isImmersed);

  if (statusFilter == "Incomplete")
    filteredData = filteredData.map((data) => !data.isImmersed);

  // typeOfInstaller

  if (typeFilter === "private")
    filteredData = filteredData.map(
      (data) => data.typeOfInstaller == "private"
    );
  if (typeFilter === "public")
    filteredData = filteredData.map((data) => data.typeOfInstaller == "public");
  if (typeFilter === "organization")
    filteredData = filteredData.map(
      (data) => data.typeOfInstaller == "organization"
    );

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    console.log(event.target.value);
  };
  const handleTypeFilter = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
    setSelectedSubPlace(""); // Clear sub-place when place changes
  };

  const handleSubPlaceChange = (event) => {
    setSelectedSubPlace(event.target.value);
  };

  // const filteredData = allIdols.filter((item) => {
  //   const matchesStatus =
  //     statusFilter === "all" ||
  //     (statusFilter === "COMPLETE" && item.isImmersed) ||
  //     (statusFilter === "INCOMPLETE" && !item.isImmersed);
  //   const matchesDate =
  //     !selectedDate ||
  //     new Date(item.immersionDate).toLocaleDateString() ===
  //       new Date(selectedDate).toLocaleDateString();
  //   return matchesStatus && matchesDate;
  // });

  const headerText = selectedPlace ? `${selectedPlace}` : "";

  return (
    <div className="mx-5 my-2 viewDiv">
      <p className="h1 text-center mb-3">{headerText} Station</p>
      <div className="row mb-5" id="sp-filters">
        <div className="col-lg-3 my-2">
          <label htmlFor="placeSelect" className="me-sm-2 mb-2">
            Sub Division :
          </label>
          <select
            id="placeSelect"
            className="form-select"
            value={selectedPlace}
            onChange={handlePlaceChange}
          >
            <option value="">Select Sub Division</option>
            {SP.dspIds.map((subdiv) => (
              <option key={subdiv._id} value={subdiv.dspDivision}>
                {subdiv.dspDivision}
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
            value={selectedSubPlace}
            onChange={handleSubPlaceChange}
          >
            <option value="">Select Police Station</option>
            {SP.dspIds
              .find((dsp) => dsp.dspDivision === selectedPlace)
              ?.stationIds.map((station) => (
                <option key={station._id} value={station.stationId}>
                  {station.stationLocation}
                </option>
              ))}
          </select>
        </div>

        <div className="col-lg-2 my-2">
          <label htmlFor="statusSelect" className="me-sm-2 mb-2">
            Status :
          </label>
          <select
            id="statusSelect"
            className="form-select"
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        <div className="col-lg-2 my-2">
          <label htmlFor="typeSelect" className="me-sm-2 mb-2">
            Type :
          </label>
          <select
            id="typeSelect"
            className="form-select"
            value={typeFilter}
            onChange={handleTypeFilter}
          >
            <option value="all">All</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="organisation">Organisation</option>
          </select>
        </div>

        <div className="col-lg-2 my-2">
          <label htmlFor="dateInput" className="me-sm-2 mb-2">
            Date :
          </label>
          <input
            id="dateInput"
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="table-responsive-lg">
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
            {filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px" }}>{i + 1}</td>
                  <td style={{ padding: "8px" }}>{item.idol_id}</td>
                  <td style={{ padding: "8px" }}>{item.hamletVillage}</td>
                  <td style={{ padding: "8px" }}>{item.placeOfImmersion}</td>
                  <td style={{ padding: "8px" }}>{item.typeOfInstaller} </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(item.immersionDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {item.isImmersed ? "Complete" : "Incomplete"}
                  </td>
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
