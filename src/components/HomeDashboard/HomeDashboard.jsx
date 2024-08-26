import logo from "/tnpolicelogo.png";
import banner from "/banner.jpeg";
import HomeView from "./HomeView";
import "./homeDashboard.css";

export default function HomeDashboard({ setDashview, handleLogout }) {
  return (
    <div className="App">
      <header className="App-header">
        <div className="d-flex mx-4 align-items-center">
          <img src={logo} alt="tn police logo" id="policeLogo"></img>
          <p className="h1 mx-4"> District Police</p>
        </div>
        <img src={banner} id="nav_banner"></img>
      </header>
      <div className="text-end mx-5">
        <button className="btn my-4  btn-danger ms-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div>
        <h1 className="h1 text-center mt-3 mb-4">Home Page</h1>
        <HomeView setDashview={setDashview} />
      </div>
    </div>
  );
}
