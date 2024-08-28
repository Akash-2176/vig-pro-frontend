import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import API_BASE_URL from "../../../apiConfig";
import Loading from "../loading/Loading";
import SPListDashboard from "../SP/SPListDashboard";
import SPMainDashboard from "../SP/SPMainDashboard";
import SPMapView from "../SP/SPMapView";
import HomeDashboard from "../HomeDashboard/HomeDashboard";
import "./SPDashboard_style.css";

export default function SPDashboard() {
  const navigate = useNavigate();

  const [SP, setSP] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [dashview, setDashview] = useState("dashboard");

  useEffect(() => {
    const storedCredentials = localStorage.getItem("sptoken");
    const credentialData = JSON.parse(storedCredentials);

    if (!storedCredentials || !credentialData) {
      navigate("/login/sp", { replace: true });
    } else {
      fetchSPData(credentialData);
    }
  }, [navigate]);

  const fetchSPData = async (credentialData) => {
    try {
      setShowLoading(true);
      const response = await axios.post(`${API_BASE_URL}/sps/getsp`, {
        spId: credentialData,
      });
      const updatedSP = response.data;
      setSP(updatedSP);
    } catch (error) {
      console.error("Error fetching station data", error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/sp", { replace: true });
  };

  const handleHomeDashboard = () => {
    setDashview("dashboard");
  };

  const dashboardview = () => {
    switch (dashview) {
      case "dashboard":
        return (
          <HomeDashboard
            handleLogout={handleLogout}
            setDashview={setDashview}
          />
        );
      case "dashboardlist":
        return (
          <SPListDashboard
            SP={SP}
            handleLogout={handleLogout}
            onBackNav={handleHomeDashboard}
          />
        );
      case "dashboardmap":
        return <SPMapView SP={SP} onBackNav={handleHomeDashboard} />; // Placeholder for dashboardmap case
      default:
        return <div>Unknown dashboard view</div>;
    }
  };

  return (
    <div className="App">{showLoading ? <Loading /> : dashboardview()}</div>
  );
}
