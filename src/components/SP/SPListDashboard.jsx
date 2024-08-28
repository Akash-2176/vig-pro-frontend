import React from "react";
import logo from "/tnpolicelogo.png";
import banner from "/banner.jpeg";
import SPTableComponent from "../SP/SPTableComponent";

export default function SPListDashboard({ SP, handleLogout, onBackNav }) {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <div className="d-flex mx-4 align-items-center">
            <img src={logo} alt="tn police logo" id="policeLogo"></img>
            <p className="h1 mx-4"> District Police</p>
          </div>

          <img src={banner} id="nav_banner"></img>
        </header>
        <div className="text-end mx-5">
          <button
            className="btn btn-success fs-5 text-light ms-2 me-2"
            onClick={onBackNav}
          >
            Back
          </button>
          <button
            className="btn my-4 fs-5 btn-danger ms-2"
            onClick={handleLogout}
          >
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
