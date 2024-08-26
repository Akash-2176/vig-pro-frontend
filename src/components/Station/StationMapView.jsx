import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinimg from "/mappin.png";

const customIcon = L.icon({
  iconUrl: pinimg, // Replace with the URL to your custom icon image
  iconSize: [64, 64], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const StationMapView = ({ station, onBackNav }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const allIdols = station.stationIdol;

  useEffect(() => {
    if (!mapInstance.current) {
      // Set default map center and zoom
      mapInstance.current = L.map(mapRef.current).setView(
        [11.225, 78.1652],
        12
      );

      // Add Esri World Imagery Layer
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 18,
          opacity: 1,
        }
      ).addTo(mapInstance.current);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, NAVTEQ",
          maxZoom: 18,
          opacity: 1,
        }
      ).addTo(mapInstance.current);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, HERE, DeLorme, USGS, Intermap, increment P Corp.",
          maxZoom: 18,
          opacity: 1,
        }
      ).addTo(mapInstance.current);
    }

    // Clean up markers on re-render
    markersRef.current.forEach((marker) =>
      mapInstance.current.removeLayer(marker)
    );
    markersRef.current = [];

    allIdols.forEach((idol) => {
      if (idol.startCoords) {
        console.log(idol);
        const { lat, lon } = idol.startCoords;
        const marker = L.marker([lat, lon], { icon: customIcon })
          .bindPopup(
            `<b>${idol.idol_id}</b><br>Hamletvillage: ${idol.hamletVillage}`
          )
          .addTo(mapInstance.current);
        markersRef.current.push(marker); // Store marker references for cleanup
      }
    });

    // Add markers for each village
    // Object.keys(villages).forEach((district) => {
    //   villages[district].forEach((village) => {
    //     const { lat, log } = village.coords;
    //     const marker = L.marker([lat, log], { icon: customIcon })
    //       .bindPopup(`<b>${village.place}</b><br>District: ${district}`)
    //       .addTo(mapInstance.current);
    //     markersRef.current.push(marker); // Store marker references for cleanup
    //   });
    // });
  }, [station]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: "20px",
          top: "20px",
          zIndex: 1000,
        }}
      >
        <button className="btn btn-dark ms-2 me-2" onClick={onBackNav}>
          Back
        </button>
      </div>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />
    </>
  );
};

export default StationMapView;
