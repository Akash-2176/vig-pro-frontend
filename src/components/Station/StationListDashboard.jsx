import React from "react";
import StationIdolList from "../Station/StationIdolList";
import Form from "../form/Form";
import logo from "/tnpolicelogo.png";
import banner from "/banner.jpeg";
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
            <img src={logo} alt="tn police logo" id="policeLogo"></img>
            <p className="h1 mx-3"> District Police</p>
          </div>
          <img src={banner} id="nav_banner"></img>
        </div>

        <div className="text-end mt-3 pe-4">
          <button
            className="btn btn-success"
            onClick={() => setShowAddIdol(true)}
          >
            Add Idol
          </button>
          <button className="btn btn-dark ms-2 me-2" onClick={onBackNav}>
            Back
          </button>

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
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
