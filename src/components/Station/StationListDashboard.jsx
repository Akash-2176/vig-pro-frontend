import React from "react";
import StationIdolList from "../Station/StationIdolList";
import Form from "../form/Form";
import logo from "/tnpolicelogo.png";
import banner from "/banner.png";
export default function StationListDashboard({
  station,
  setStation,
  setShowAddIdol,
  handleLogout,
  addIdolToStation,
  showAddIdol,
  setShowLoading,
  handleAddIdolClose,
  onBackNav,
}) {
  return (
    <>
      <header>
        <div className="stationlist-nav">
          <div className="d-flex mx-4 align-items-center">
            <img
              src={logo}
              alt="tn police logo"
              id="station-dashboard-policeLogo"
            ></img>
            <p className="h1 mx-3"> District Police</p>
          </div>
          <img src={banner} id="station-dashboard-banner"></img>
        </div>

        <div className="d-flex justify-content-between">
          <div className="ms-3   mt-3 ">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="mt-3 me-3">
            <button
              className="btn btn-success mx-3"
              onClick={() => setShowAddIdol(true)}
            >
              Add Idol
            </button>{" "}
            <button className="btn btn-dark" onClick={onBackNav}>
              Back
            </button>
          </div>
        </div>
      </header>

      {station && (
        <>
          <StationIdolList station={station} setStation={setStation} />
          {showAddIdol && (
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
              }}
            >
              <Form
                onClose={handleAddIdolClose}
                stationId={station.stationId}
                onAddIdol={addIdolToStation}
                onLoading={setShowLoading}
                station={station}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
