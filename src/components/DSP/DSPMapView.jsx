import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinimg from "/mappin.png";
import "./map.css";

const customIcon = L.icon({
  iconUrl: pinimg, // Replace with the URL to your custom icon image
  iconSize: [64, 64], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const DSPMapView = ({ DSP, onBackNav }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  console.log(DSP);

  const allIdols = DSP.stationIds.flatMap((station) => station.stationIdol);
  console.log(allIdols);

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

    const showRoute = (idol) => {
      if (routingControlRef.current) {
        routingControlRef.current.remove(); // Remove existing route if any
      }

      const startPoint = L.latLng(idol.startCoords.lat, idol.startCoords.lon);
      const junctionPoint = L.latLng(
        idol.startJunctionPoint.coords.lat,
        idol.startJunctionPoint.coords.lon
      );
      const endPoint = L.latLng(idol.endCoords.lat, idol.endCoords.lon);
      const intermediatePoint = idol.intermediateJunctionPoints.map((point) =>
        L.latLng(point.coords.lat, point.coords.lon)
      );

      console.log(startPoint, junctionPoint, endPoint, intermediatePoint);
      // console.log(junctionPoint, ...intermediatePoint, endPoint);

      // Add a route from the starting point to the junction
      routingControlRef.current = L.Routing.control({
        waypoints: [startPoint, junctionPoint],
        routeWhileDragging: false, // Disable dragging of route
        showAlternatives: true,
        altLineOptions: {
          styles: [{ color: "blue", opacity: 0.7, weight: 5 }],
        },
        createMarker: function () {
          return null;
        }, // Disable waypoint markers
        draggableWaypoints: false, // Disable dragging of waypoints
        addWaypoints: false, // Disable adding waypoints by clicking
      }).addTo(mapInstance.current);

      routingControlRef.current.on("routesfound", function (e) {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          // Fetch the route from junction to the endpoint via intermediate waypoints
          L.Routing.control({
            waypoints: [junctionPoint, ...intermediatePoint, endPoint],
            routeWhileDragging: false, // Disable dragging of route
            lineOptions: {
              styles: [{ color: "red", opacity: 0.7, weight: 5 }],
            },
            createMarker: function () {
              return null;
            }, // Disable waypoint markers
            draggableWaypoints: false, // Disable dragging of waypoints
            addWaypoints: false, // Disable adding waypoints by clicking
          }).addTo(mapInstance.current);

          // Hide the route list
          const controlContainer = document.querySelector(
            ".leaflet-routing-container"
          );
          if (controlContainer) {
            controlContainer.style.display = "none";
          }
        }
      });
    };

    allIdols.forEach((idol) => {
      if (idol.startCoords)
        L.marker(L.latLng(idol.startCoords.lat, idol.startCoords.lon), {
          icon: customIcon,
        })
          .addTo(mapInstance.current)
          .on("click", () => showRoute(idol));
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
  }, [DSP]);
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

export default DSPMapView;
