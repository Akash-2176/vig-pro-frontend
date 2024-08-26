import { useState, useEffect } from "react";
import API_BASE_URL from "../../../apiConfig";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/loading";
import axios from "axios";
import StationListDashboard from "../Station/StationListDashboard";
import StationMainDashboard from "../Station/StationMainDashboard";
import StationMapView from "../Station/StationMapView";
import HomeDashboard from "../HomeDashboard/HomeDashboard";

export default function StationDashboard() {
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [showAddIdol, setShowAddIdol] = useState(false);
  const [showLoading, setShowLoading] = useState(true); // Start as true to show loading initially
  const [dashview, setDashview] = useState("dashboard"); // Set a default value for dashview

  useEffect(() => {
    const storedCredentials = localStorage.getItem("stationtoken");
    const credentialData = JSON.parse(storedCredentials);

    if (!storedCredentials || !credentialData) {
      navigate("/login", { replace: true });
    } else {
      fetchStationData(credentialData);
    }
  }, [navigate]);

  const fetchStationData = async (credentialData) => {
    try {
      setShowLoading(true);
      const response = await axios.post(`${API_BASE_URL}/stations/getstation`, {
        stationId: credentialData,
      });
      const updatedStation = response.data;
      setStation(updatedStation);
    } catch (error) {
      console.error("Error fetching station data", error);
    } finally {
      setShowLoading(false);
    }
  };

  const addIdolToStation = (newIdol) => {
    if (station) {
      const updatedStation = {
        ...station,
        stationIdol: [...station.stationIdol, newIdol],
      };
      setStation(updatedStation);
    }
  };

  const updateIdolInStation = (updatedIdol) => {
    if (station) {
      const updatedStation = {
        ...station,
        stationIdol: station.stationIdol.map((idol) =>
          idol.idol_id === updatedIdol.idol_id
            ? { ...idol, ...updatedIdol }
            : idol
        ),
      };
      setStation(updatedStation);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleAddIdolClose = () => {
    setShowAddIdol(false);
  };

  const handleHomeDashboard = () => {
    setDashview("dashboard");
  };

  // Correctly defining the dashboardview function
  const dashboardview = () => {
    switch (dashview) {
      case "dashboard":
        // return <StationMainDashboard setDashview={setDashview} />;
        return (
          <HomeDashboard
            handleLogout={handleLogout}
            setDashview={setDashview}
          />
        );
      case "dashboardlist":
        return (
          <StationListDashboard
            station={station}
            setStation={setStation}
            setShowAddIdol={setShowAddIdol}
            handleLogout={handleLogout}
            addIdolToStation={addIdolToStation}
            showLoading={showLoading}
            showAddIdol={showAddIdol}
            handleAddIdolClose={handleAddIdolClose}
            // setDashview={setDashview}
            onBackNav={handleHomeDashboard}
          />
        );
      case "dashboardmap":
        return (
          <StationMapView station={station} onBackNav={handleHomeDashboard} />
        ); // Placeholder for dashboardmap case
      default:
        return <div>Unknown dashboard view</div>;
    }
  };

  // Returning the dashboardview function call properly
  return (
    <>
      <div>{showLoading ? <Loading /> : dashboardview()}</div>
    </>
  );
}
