import { useState, useEffect } from "react";
import API_BASE_URL from "../../../apiConfig";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
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

  // const allIdols = station.stationIdol;
  // // starts
  // const noOfApplication = allIdols.length;
  // const stationIdolCounts = allIdols.reduce(
  //   (counts, idol) => {
  //     if (idol.isImmersed) {
  //       counts.immersed += 1;
  //     } else {
  //       counts.notImmersed += 1;
  //     }
  //     return counts;
  //   },
  //   { immersed: 0, notImmersed: 0 } // Initial count values
  // );

  // console.log(noOfApplication, stationIdolCounts);

  // const noOfImmersed = stationIdolCounts.immersed;
  // const noOfNotImmersed = stationIdolCounts.notImmersed;

  // const counts = allIdols.reduce(
  //   (acc, idol) => {
  //     switch (idol.typeOfInstaller) {
  //       case "Public":
  //         acc.public += 1;
  //         break;
  //       case "Private":
  //         acc.private += 1;
  //         break;
  //       case "Organization":
  //         acc.organization += 1;
  //         break;
  //       default:
  //         break;
  //     }
  //     return acc;
  //   },
  //   { public: 0, private: 0, organization: 0 }
  // );
  // const stats = {
  //   Sensitive: {
  //     totalRegistered: 0,
  //     totalImmersed: 0,
  //     totalNotImmersed: 0,
  //   },
  //   NonSensitive: {
  //     totalRegistered: 0,
  //     totalImmersed: 0,
  //     totalNotImmersed: 0,
  //   },
  //   "Hyper-Sensitive": {
  //     totalRegistered: 0,
  //     totalImmersed: 0,
  //     totalNotImmersed: 0,
  //   },
  // };

  // allIdols.forEach((idol) => {
  //   const { sensitivity, isImmersed } = idol;

  //   if (sensitivity && stats[sensitivity]) {
  //     stats[sensitivity].totalRegistered += 1;
  //     if (isImmersed) {
  //       stats[sensitivity].totalImmersed += 1;
  //     } else {
  //       stats[sensitivity].totalNotImmersed += 1;
  //     }
  //   }
  // });

  // Correctly defining the dashboardview function
  const dashboardview = () => {
    switch (dashview) {
      case "dashboard":
        // return <StationMainDashboard setDashview={setDashview} />;
        return (
          <HomeDashboard
            station={station}
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
