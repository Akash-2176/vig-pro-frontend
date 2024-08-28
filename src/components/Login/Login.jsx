import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login_style.css";
import axios from "axios";
import Loading from "../loading/loading";
import API_BASE_URL from "../../../apiConfig";
import loginBg from "/loginBG.png";

function Login({ loginUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    setShowLoading(true);
    let loginData = {};
    let apiEndpoint = "";
    let storageKey = "";
    let link = "";

    // Determine the API endpoint, login data, and storage key based on the user type
    switch (loginUser) {
      case "Station":
        apiEndpoint = `${API_BASE_URL}/stations/login`;
        loginData = { stationId: username, password };
        storageKey = "stationtoken";
        link = "station";
        break;
      case "DSP":
        apiEndpoint = `${API_BASE_URL}/dsps/login`;
        loginData = { dspId: username, password };
        storageKey = "dsptoken";
        link = "dsp";
        break;
      case "SP":
        apiEndpoint = `${API_BASE_URL}/sps/login`;
        loginData = { spId: username, password };
        storageKey = "sptoken";
        link = "sp";
        break;
      case "DIG":
        apiEndpoint = `${API_BASE_URL}/digs/login`;
        loginData = { digId: username, password };
        storageKey = "digtoken";
        link = "dig";
        break;
      case "IG":
        apiEndpoint = `${API_BASE_URL}/igs/login`;
        loginData = { igId: username, password };
        storageKey = "igtoken";
        link = "ig";
        break;
      default:
        setErrorMessage("Invalid user type.");
        return;
    }

    try {
      localStorage.clear();
      const response = await axios.post(apiEndpoint, loginData);
      if (response.data) {
        localStorage.setItem(storageKey, JSON.stringify(response.data));
        navigate(`/${link}/dashboard`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="login-container">
      {showLoading && <Loading />}
      <div className=" login-box p-4 p-md-5">
        <p className="text-center h1 display-4 mb-4">{loginUser} Login</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="username" className="form-label h5">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label h5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="loginbtn-div text-center">
            <button
              type="submit"
              id="loginbtn"
              className="btn btn-dark font-weight-bold  btn-lg fs-4"
            >
              Login <span className="login_btn_line"></span>
            </button>
          </div>
          {errorMessage && (
            <p className="text-center mt-3 text-danger">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
