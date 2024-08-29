import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
// import pinimg from "/mappin.png";
import "./map.css";
import blueMarker from "/mappin.png"; // Example: Marker for Private
import greenMarker from "/pinimg1.png"; // Example: Marker for Public place
import blackMarker from "/pinimg3.png";

// const customIcon = L.icon({
//   iconUrl: pinimg,
//   iconSize: [64, 64],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

const StationMapView = ({ station, onBackNav }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);
  const junctionToEndRouteRef = useRef(null);
  const [filters, setFilters] = useState({
    type: "",
    sensitivity: "",
    dateOfImmersion: "",
  });

  const allIdols = station.stationIdol;

  useEffect(() => {
    if (!mapInstance.current) {
      let centerCoords = [11.225, 78.1652];
      if (station.stationCoords)
        centerCoords = [station.stationCoords.lat, station.stationCoords.lon];

      // Initialize the map
      mapInstance.current = L.map(mapRef.current).setView(centerCoords, 12);

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

    // Define the custom icons
    const iconMap = {
      private: L.icon({
        iconUrl: blueMarker,
        iconSize: [52, 52],
        iconAnchor: [16, 32],
      }),
      public: L.icon({
        iconUrl: greenMarker,
        iconSize: [52, 52],
        iconAnchor: [16, 32],
      }),
      organization: L.icon({
        iconUrl: blackMarker,
        iconSize: [52, 52],
        iconAnchor: [16, 32],
      }),
    };

    // Clean up previous markers
    markersRef.current.forEach(({ marker }) =>
      mapInstance.current.removeLayer(marker)
    );
    markersRef.current = [];

    // Add new markers
    allIdols.forEach((idol) => {
      if (idol.startCoords) {
        const icon = iconMap[idol.typeOfInstaller] || blackMarker;
        const { lat, lon } = idol.startCoords;
        const marker = L.marker([lat, lon], { icon: icon })
          .bindPopup(
            `${idol.idol_id} <br>
            <b>${idol.stationLocation}</b><br>  
            Type : ${idol.typeOfInstaller} - ${
              idol.typeOfInstaller === "organization"
                ? `${idol.organizationName}`
                : ""
            } <br>
              Sensitivity : ${idol.sensitivity}
              <br>Hamletvillage: ${idol.hamletVillage}`
          )
          .addTo(mapInstance.current);
        markersRef.current.push({ marker, data: idol });
      }
    });

    const showRoute = (idol) => {
      const startPoint = L.latLng(idol.startCoords.lat, idol.startCoords.lon);
      const junctionPoint = L.latLng(
        idol.startJunctionPoint.coords.lat,
        idol.startJunctionPoint.coords.lon
      );
      const endPoint = L.latLng(idol.endCoords.lat, idol.endCoords.lon);
      const intermediatePoint = idol.intermediateJunctionPoints.map((point) =>
        L.latLng(point.coords.lat, point.coords.lon)
      );

      markersRef.current.forEach(({ marker }) => {
        if (marker.getLatLng().equals(startPoint)) {
          marker.addTo(mapInstance.current);
        } else {
          marker.remove();
        }
      });

      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }

      if (junctionToEndRouteRef.current) {
        junctionToEndRouteRef.current.remove();
        junctionToEndRouteRef.current = null;
      }

      const startPointData = markersRef.current.find(({ marker }) =>
        marker.getLatLng().equals(startPoint)
      ).data;

      let routeColor = "blue";
      switch (idol.sensitivity) {
        case "Hyper-Sensitive":
          routeColor = "red";
          break;
        case "Sensitive":
          routeColor = "orange";
          break;
        case "Nonsensitive":
          routeColor = "green";
          break;
        default:
          routeColor = "blue";
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [startPoint, junctionPoint],
        routeWhileDragging: false,
        showAlternatives: true,
        altLineOptions: {
          styles: [{ color: "blue", opacity: 0.7, weight: 5 }],
        },
        createMarker: () => null,
        draggableWaypoints: false,
        addWaypoints: false,
      }).addTo(mapInstance.current);

      routingControlRef.current.on("routesfound", (e) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          if (junctionToEndRouteRef.current) {
            junctionToEndRouteRef.current.remove();
          }

          junctionToEndRouteRef.current = L.Routing.control({
            waypoints: [junctionPoint, ...intermediatePoint, endPoint],
            routeWhileDragging: false,
            lineOptions: {
              styles: [{ color: routeColor, opacity: 1, weight: 5 }],
            },
            createMarker: () => null,
            draggableWaypoints: false,
            addWaypoints: false,
          }).addTo(mapInstance.current);
        }
      });
    };

    const restoreMarkers = () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
      if (junctionToEndRouteRef.current) {
        junctionToEndRouteRef.current.remove();
        junctionToEndRouteRef.current = null;
      }

      markersRef.current.forEach(({ marker }) => {
        marker.addTo(mapInstance.current);
      });
    };

    markersRef.current.forEach(({ marker, data }) => {
      marker.on("click", () => showRoute(data));
    });

    mapInstance.current.on("click", (e) => {
      if (!e.latlng || !routingControlRef.current) return;

      const routeLayer = routingControlRef.current.getPlan()._routes;
      let clickedOnRoute = false;

      if (routeLayer && routeLayer.length > 0) {
        clickedOnRoute = routeLayer.some((route) => {
          return route.coordinates.some((coord) => {
            const dist = e.latlng.distanceTo(L.latLng(coord.lat, coord.lng));
            return dist < 10; // Adjust threshold as needed
          });
        });
      }

      if (!clickedOnRoute) {
        restoreMarkers();
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [station]);
  // useEffect(() => {
  //   markersRef.current.forEach(({ marker, data }) => {
  //     const matchesType = filters.type ? data.type === filters.type : true;
  //     const matchesSensitivity = filters.sensitivity
  //       ? data.sensitivity === filters.sensitivity
  //       : true;
  //     const matchesDate = filters.dateOfImmersion
  //       ? data.dateOfImmersion === filters.dateOfImmersion
  //       : true;

  //     if (matchesType && matchesSensitivity && matchesDate) {
  //       marker.addTo(mapInstance.current); // Show marker
  //     } else {
  //       marker.remove(); // Hide marker
  //     }
  //   });
  // }, [filters]);

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
      {/* <div style={{ marginBottom: "10px" }}>
        <select
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="Private">Private</option>
          <option value="Private in public place">
            Private in public place
          </option>
          <option value="Organization in public place">
            Organization in public place
          </option>
        </select>
        <select
          onChange={(e) =>
            setFilters({ ...filters, sensitivity: e.target.value })
          }
        >
          <option value="">Select Sensitivity</option>
          <option value="HyperSensitive">HyperSensitive</option>
          <option value="Sensitive">Sensitive</option>
          <option value="NonSensitive">NonSensitive</option>
        </select>
        <select
          onChange={(e) =>
            setFilters({ ...filters, dateOfImmersion: e.target.value })
          }
        >
          <option value="">Select Date of Immersion</option>
          <option value="07/09/2024">07/09/2024</option>
          <option value="08/09/2024">08/09/2024</option>
          <option value="09/09/2024">09/09/2024</option>
        </select>
      </div> */}
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />
    </>
  );
};

export default StationMapView;
