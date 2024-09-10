import { useEffect, useState } from "react";
import { v4 } from "uuid";
import MapComponent from "./MapComponent";
import "./tracking_style.css";
import { SOCKET_BASE_URL } from "../../../apiConfig";

export default function Tracking({ onBackNav }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_BASE_URL);

    ws.onopen = () => {
      let locationData = {
        id: v4(),
        type: "admin",
        data: {},
      };
      ws.send(JSON.stringify(locationData)); // send initial data
    };

    ws.onmessage = (event) => {
      const locationDatas = JSON.parse(event.data);
      setLocations(() => locationDatas);
    };
    // return () => ws.close();
  }, []);

  // useEffect(() => {
  //   console.log(locations);
  // }, [locations]);

  return (
    <>
      {/* Welcome */}
      <main className="map__container">
        <MapComponent locations={locations} onBackNav={onBackNav} />
      </main>
    </>
  );
}
