import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login_style.css";
import axios from "axios";
import Loading from "../loading/loading";
import API_BASE_URL from "../../../apiConfig";

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
      <div className="bg-light rounded p-5 px-5">
        <h2 className="text-center mb-3">{loginUser} Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label fs-5">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control mb-3 form-control-md fs-5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label fs-5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control fs-5"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-100">
            Login
          </button>
          {errorMessage && (
            <p className="text-center mt-4 fs-5 text-danger">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
