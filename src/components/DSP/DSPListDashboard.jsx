import React from "react";
import logo from "/tnpolicelogo.png";
import banner from "/banner.jpeg";
import DSPTableComponent from "../DSP/DSPTableComponent";

export default function DSPListDashboard({ DSP, handleLogout, onBackNav }) {
  return (
    <div className="App">
      <header className="App-header">
        <div className="d-flex mx-4 align-items-center">
          <img src={logo} alt="tn police logo" id="policeLogo"></img>
          <p className="h1 mx-3"> District Police</p>
        </div>
        <button
          className="btn btn-light text-dark ms-2 me-2"
          onClick={onBackNav}
        >
          Back
        </button>
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Logout
        </button>
        <img src={banner} id="nav_banner"></img>
      </header>
      <div id="body">
        <h1 className="h1 text-center my-3">
          (DSP {DSP.dspDivision} Zone) Idol Immersion Records
        </h1>
        <DSPTableComponent DSP={DSP} />
      </div>
    </div>
  );
}
