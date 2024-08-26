import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dspdashboard_style.css";
import axios from "axios";
import Loading from "../loading/loading";
import API_BASE_URL from "../../../apiConfig";
import DSPListDashboard from "../DSP/DSPListDashboard";
import DSPMainDashboard from "../DSP/DSPMainDashboard";
import DSPMapView from "../DSP/DSPMapView";
import HomeDashboard from "../HomeDashboard/HomeDashboard";

export default function DSPDashboard() {
  const navigate = useNavigate();

  const [DSP, setDSP] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [dashview, setDashview] = useState("dashboard");
  useEffect(() => {
    const storedCredentials = localStorage.getItem("dsptoken");
    const credentialData = JSON.parse(storedCredentials);

    if (!storedCredentials || !credentialData) {
      navigate("/login/dsp", { replace: true });
    } else {
      fetchDSPData(credentialData);
    }
  }, [navigate]);

  const fetchDSPData = async (credentialData) => {
    try {
      setShowLoading(true);
      const response = await axios.post(`${API_BASE_URL}/dsps/getdsp`, {
        dspId: credentialData,
      });
      const updatedDSP = response.data;
      setDSP(updatedDSP);
    } catch (error) {
      console.error("Error fetching station data", error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/dsp", { replace: true });
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
          <DSPListDashboard
            DSP={DSP}
            handleLogout={handleLogout}
            onBackNav={handleHomeDashboard}
          />
        );
      case "dashboardmap":
        return <DSPMapView on DSP={DSP} onBackNav={handleHomeDashboard} />; // Placeholder for dashboardmap case
      default:
        return <div>Unknown dashboard view</div>;
    }
  };

  return <div>{showLoading ? <Loading /> : dashboardview()}</div>;
}
