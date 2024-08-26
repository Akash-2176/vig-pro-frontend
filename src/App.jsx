import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login/Login";
import StationDashboard from "./components/Dashboard/StationDashboard";
import DSPDashboard from "./components/Dashboard/DSPDashboard";
import SPDashboard from "./components/Dashboard/SPDashboard";
// import DIGDashboard from "./components/Dashboard/DIGDashboard";
// import IGDashboard from "./components/Dashboard/IGDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import NotFound from "./components/Error404Page/NotFound";
// import "bootstrap/dist/css/bootstrap.css";

function App() {
  const getUserType = () => {
    if (localStorage.getItem("stationtoken")) return "station";
    if (localStorage.getItem("dsptoken")) return "dsp";
    if (localStorage.getItem("sptoken")) return "sp";
    if (localStorage.getItem("digtoken")) return "dig";
    if (localStorage.getItem("igtoken")) return "ig";
    return null;
  };

  const userType = getUserType();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={userType ? `/${userType}/dashboard` : "/login"} />
          }
        />

        {/* Define login routes with different user types */}
        <Route path="/login" element={<Login loginUser="Station" />} />
        <Route path="/login/dsp" element={<Login loginUser="DSP" />} />
        <Route path="/login/sp" element={<Login loginUser="SP" />} />
        <Route path="/login/dig" element={<Login loginUser="DIG" />} />
        <Route path="/login/ig" element={<Login loginUser="IG" />} />

        {/* Define corresponding dashboard routes */}
        <Route path="/station/dashboard" element={<StationDashboard />} />
        <Route path="/dsp/dashboard" element={<DSPDashboard />} />
        <Route path="/sp/dashboard" element={<SPDashboard />} />
        {/* <Route path="/dig/dashboard" element={<DIGDashboard />} /> */}
        {/* <Route path="/ig/dashboard" element={<IGDashboard />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
