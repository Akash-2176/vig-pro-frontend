import logo from "/tnpolicelogo.png";
import banner from "/banner.jpeg";
import HomeView from "./HomeView";
import "./homedashboard.css";
import { useEffect, useState } from "react";

export default function HomeDashboard({
  station,
  setDashview,
  handleLogout,
  type,
  DSP,
  SP,
}) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let allIdols = [];
    if (type === "Station") {
      console.log(type);

      allIdols = station.stationIdol;
    }
    if (type === "DSP") {
      console.log(type);

      allIdols = DSP.stationIds.flatMap((station) => station.stationIdol);
    }
    if (type === "SP") {
      console.log(type);

      allIdols = SP.dspIds.flatMap((dsp) =>
        dsp.stationIds.flatMap((station) =>
          station.stationIdol.map((idol) => ({
            ...idol,
            stationLocation: station.stationLocation,
            stationDivision: station.stationDivision,
          }))
        )
      );
    }
    console.log(allIdols);
    const calculateAllStats = (allIdols) => {
      const stats = {
        totalRegistered: 0,
        totalImmersed: 0,
        totalNotImmersed: 0,
        Sensitive: {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
        Nonsensitive: {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
        "Hyper-Sensitive": {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
        Private: {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
        Public: {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
        Organization: {
          totalRegistered: 0,
          totalImmersed: 0,
          totalNotImmersed: 0,
        },
      };
      allIdols.forEach((idol) => {
        const { sensitivity, isImmersed, typeOfInstaller } = idol;

        // Increment total counts
        stats.totalRegistered += 1;
        if (isImmersed) {
          stats.totalImmersed += 1;
        } else {
          stats.totalNotImmersed += 1;
        }

        // Increment sensitivity-specific counts
        if (sensitivity && stats[sensitivity]) {
          stats[sensitivity].totalRegistered += 1;
          if (isImmersed) {
            stats[sensitivity].totalImmersed += 1;
          } else {
            stats[sensitivity].totalNotImmersed += 1;
          }
        }

        // Increment installer type counts for public, private, and organization
        if (typeOfInstaller === "private") {
          stats.Private.totalRegistered += 1;
          if (isImmersed) {
            stats.Private.totalImmersed += 1;
          } else {
            stats.Private.totalNotImmersed += 1;
          }
        } else if (typeOfInstaller === "public") {
          stats.Public.totalRegistered += 1;
          if (isImmersed) {
            stats.Public.totalImmersed += 1;
          } else {
            stats.Public.totalNotImmersed += 1;
          }
        } else if (typeOfInstaller === "organization") {
          stats.Organization.totalRegistered += 1;
          if (isImmersed) {
            stats.Organization.totalImmersed += 1;
          } else {
            stats.Organization.totalNotImmersed += 1;
          }
        }
      });

      return stats;
    };
    setStats(() => calculateAllStats(allIdols));
  }, [station, DSP, SP]);

  console.log(stats);

  return (
    <div className="App">
      <header className="App-header">
        <div className="d-flex mx-4 align-items-center">
          <img src={logo} alt="tn police logo" id="homepage-policeLogo"></img>
          <p className="h1 mx-4"> District Police</p>
        </div>
        <img src={banner} id="homepage-nav_banner"></img>
      </header>
      <div className="text-end mx-5">
        <button
          className="btn mt-2 fs-5  btn-danger ms-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div>
        <h1 className="h1 text-center mt-2 mb-2">Home Page</h1>
        <HomeView setDashview={setDashview} stats={stats} />
        {/* <HomeView setDashview={setDashview} stats={null} /> */}
      </div>
    </div>
  );
}
