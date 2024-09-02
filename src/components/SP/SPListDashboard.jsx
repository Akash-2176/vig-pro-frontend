import React from "react";
import logo from "/tnpolicelogo.png";
import banner from "/banner.png";
import SPTableComponent from "../SP/SPTableComponent";

export default function SPListDashboard({ SP, handleLogout, onBackNav }) {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <div className="d-flex mx-4 align-items-center">
            <img
              src={logo}
              alt="tn police logo"
              id="sp-dashboard-policeLogo"
            ></img>
            <p className="h1 mx-4"> District Police</p>
          </div>

          <img src={banner} id="sp-dashboard-banner"></img>
        </header>
        <div className="text-end mt-2 mx-2 back-logout-sp-dashboard-btn-div">
          <button
            className="btn btn-success text-light ms-2 me-2"
            onClick={onBackNav}
          >
            Back
          </button>
          <button className="btn  btn-danger ms-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="body">
          <h1 className="h1 text-center mt-4">
            (SP view )Idol Immersion Records
          </h1>
          <SPTableComponent SP={SP} />
        </div>
      </div>
    </>
  );
}
