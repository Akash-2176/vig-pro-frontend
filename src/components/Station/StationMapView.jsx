import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import pinimg from "/mappin.png";
import "./map.css";
// import finalMarker from "/finalmarker.svg";
import finalMarker from "/finalicon.png";
import intermediateMarker from "/intermarker.svg";
import blueMarker from "/mappin.png"; // Example: Marker for Private
import greenMarker from "/pinimg1.png"; // Example: Marker for Public place
import blackMarker from "/pinimg3.png";
import chruchMarker from "/chruchicon.png";
import mosqueicon from "/mosqueicon.svg";
// import vigvehicle icon
import vigbikeMarker from "/vigbike.png";
import vigcarMarker from "/vigcar.png";
import vigtruckMarker from "/vigtruck.png";

const customIcon = L.icon({
  iconUrl: pinimg, // Replace with the URL to your custom icon image
  iconSize: [54, 54], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const intermediateIcon = L.icon({
  iconUrl: intermediateMarker, // Replace with the URL to your custom icon image
  iconSize: [36, 36], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const finalIcon = L.icon({
  iconUrl: finalMarker, // Replace with the URL to your custom icon image
  iconSize: [54, 54], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const chruchIcon = L.icon({
  iconUrl: chruchMarker, // Replace with the URL to your custom icon image
  iconSize: [36, 36], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const mosqueIcon = L.icon({
  iconUrl: mosqueicon, // Replace with the URL to your custom icon image
  iconSize: [36, 36], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const StationMapView = ({ station, onBackNav }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);
  const junctionToEndRouteRef = useRef(null);
  const junctionMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const churchCoordsRef = useRef([]);
  const mosqueCoordsRef = useRef([]);
  const [filters, setFilters] = useState({
    type: "",
    sensitivity: "",
    dateOfImmersion: "",
    organizationName: "",
    immpersionState: "Incomplete",
  });

  const filtersRef = useRef(filters);
  const [showFilter, setShowFilter] = useState(true);

  const offsetLatLon = (lat, lon, offset) => {
    const newLat = lat + offset * (Math.random() - 0.5);
    const newLon = lon + offset * (Math.random() - 0.5);
    return [newLat, newLon];
  };

  const allIdols = station.stationIdol.map((idol) => ({
    ...idol,
    newStartPoint: offsetLatLon(
      idol?.startCoords?.lat,
      idol?.startCoords?.lon,
      0.0006
    ),
  }));

  const churchCoords = [];
  const mosqueCoords = [];

  if (
    Array.isArray(station.defaultChurchPoints) &&
    station.defaultChurchPoints.length > 0
  ) {
    churchCoords.push(...station.defaultChurchPoints);
  }

  if (
    Array.isArray(station.defaultMosquePoints) &&
    station.defaultMosquePoints.length > 0
  ) {
    mosqueCoords.push(...station.defaultMosquePoints);
  }

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
        iconSize: [54, 54],
        iconAnchor: [16, 32],
      }),
      public: L.icon({
        iconUrl: greenMarker,
        iconSize: [54, 54],
        iconAnchor: [16, 32],
      }),
      organization: L.icon({
        iconUrl: blackMarker,
        iconSize: [54, 54],
        iconAnchor: [16, 32],
      }),
    };

    const junctionMapIcon = {
      "two-wheeler": L.icon({
        iconUrl: vigbikeMarker,
        iconSize: [54, 54],
        iconAnchor: [16, 32],
      }),
      "four-wheeler-open": L.icon({
        iconUrl: vigcarMarker,
        iconSize: [54, 54],
        iconAnchor: [16, 32],
      }),
      "four-wheeler-closed": L.icon({
        iconUrl: vigtruckMarker,
        iconSize: [54, 54],
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
        const icon = iconMap[idol.typeOfInstaller] || customIcon;
        const { lat, lon } = idol.startCoords;
        // const marker = L.marker([lat, lon], { icon: icon })
        const marker = L.marker(idol.newStartPoint, { icon: icon })
          .bindPopup(
            `${idol.idol_id} <br>
            <b>${idol.stationName}</b><br>  
            Type : ${idol.typeOfInstaller} - ${
              idol.typeOfInstaller === "organization"
                ? `${idol.organizationName}`
                : ""
            } <br>
              Sensitivity : ${idol.sensitivity}
              <br>Hamletvillage: ${idol.hamletVillage}`
          )
          .on("mouseover", function (e) {
            // Open popup on hover
            this.openPopup();
          })
          .on("mouseout", function (e) {
            // Close popup when not hovering
            this.closePopup();
          })
          .on("click", () => {
            // Show route on click
            showRoute(idol);
          })
          .addTo(mapInstance.current);
        markersRef.current.push({ marker, data: idol });
      }
    });

    churchCoordsRef.current = [];
    mosqueCoordsRef.current = [];

    churchCoords.forEach((chruch) => {
      const marker = L.marker([chruch.coords.lat, chruch.coords.lon], {
        icon: chruchIcon,
      }).bindPopup(`<b>${chruch.place}</b>`);
      // .on("mouseover", function (e) {
      //   // Open popup on hover
      //   this.openPopup();
      // })
      // .on("mouseout", function (e) {
      //   // Close popup when not hovering
      //   this.closePopup();
      // })

      churchCoordsRef.current.push(marker);
    });

    mosqueCoords.forEach((mosque) => {
      const marker = L.marker([mosque.coords.lat, mosque.coords.lon], {
        icon: mosqueIcon,
      }).bindPopup(`<b>${mosque.place}</b>`);
      mosqueCoordsRef.current.push(marker);
    });

    const showRoute = (idol) => {
      // const startPoint = L.latLng(idol.startCoords.lat, idol.startCoords.lon);

      setShowFilter(() => false);
      const startPoint = L.latLng(idol.newStartPoint);
      const junctionPoint = L.latLng(
        idol.startJunctionPoint.coords.lat,
        idol.startJunctionPoint.coords.lon
      );
      const endPoint = L.latLng(idol.endCoords.lat, idol.endCoords.lon);

      // NO intermediate point for short distance
      const intermediatePoint =
        Array.isArray(idol.intermediateJunctionPoints) &&
        idol.intermediateJunctionPoints.length > 0
          ? idol.intermediateJunctionPoints
              .filter(
                (point) =>
                  point && point.coords && point.coords.lat && point.coords.lon
              ) // Ensure point and coords exist
              .map((point) => L.latLng(point.coords.lat, point.coords.lon))
          : []; // Return an empty array if no valid junction points are present

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
      if (junctionMarkerRef.current) {
        junctionMarkerRef.current.remove();
        junctionMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
        endMarkerRef.current = null;
      }
      // const startPointData = markersRef.current.find(({ marker }) =>
      //   marker.getLatLng().equals(startPoint)
      // ).data;

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

      //
      // Add Junction Marker
      junctionMarkerRef.current = L.marker(
        [junctionPoint.lat, junctionPoint.lng],
        {
          icon:
            junctionMapIcon[idol.modeOfTransport.vehicleType] ||
            intermediateIcon,
        }
      ).addTo(mapInstance.current);
      junctionMarkerRef.current.bindPopup("<b>Junction point</b>").openPopup();

      // Add End Marker
      endMarkerRef.current = L.marker([endPoint.lat, endPoint.lng], {
        icon: finalIcon,
      }).addTo(mapInstance.current);
      endMarkerRef.current
        .bindPopup(
          `<b>Immersion Place</b><br><span>${idol.placeOfImmersion}</span>`
        )
        .openPopup();

      routingControlRef.current.on("routesfound", (e) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          if (junctionToEndRouteRef.current) {
            junctionToEndRouteRef.current.remove();
          }

          let waypoint = [];
          if (intermediatePoint)
            waypoint = [junctionPoint, ...intermediatePoint, endPoint];
          else waypoint = [junctionPoint, endPoint];
          junctionToEndRouteRef.current = L.Routing.control({
            waypoints: waypoint,
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
      // Adding chruch

      churchCoordsRef.current.forEach((marker) => {
        marker.addTo(mapInstance.current);
      });

      // Adding Mosque

      mosqueCoordsRef.current.forEach((marker) => {
        marker.addTo(mapInstance.current);
      });
    };

    const restoreMarkers = () => {
      // removing chruch
      churchCoordsRef.current.forEach((marker) => {
        marker.remove();
      });

      // removing Mosque

      mosqueCoordsRef.current.forEach((marker) => {
        marker.remove();
      });

      // Remove the junction and end markers
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
        endMarkerRef.current = null;
      }

      if (junctionMarkerRef.current) {
        junctionMarkerRef.current.remove();
        junctionMarkerRef.current = null;
      }

      setShowFilter(() => true);

      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
      if (junctionToEndRouteRef.current) {
        junctionToEndRouteRef.current.remove();
        junctionToEndRouteRef.current = null;
      }

      const currentFilters = filtersRef.current;
      // console.log(currentFilters);

      markersRef.current.forEach(({ marker, data }) => {
        const matchesDivision = currentFilters.subdivision
          ? data.stationDivision === currentFilters.subdivision
          : true;
        const matchesStation = currentFilters.stationLocation
          ? data.stationName === currentFilters.stationLocation
          : true;
        const matchesType = currentFilters.type
          ? data.typeOfInstaller === currentFilters.type
          : true;
        const matchesSensitivity = currentFilters.sensitivity
          ? data.sensitivity === currentFilters.sensitivity
          : true;
        const matchesDate = currentFilters.dateOfImmersion
          ? new Date(data.immersionDate).toLocaleDateString() ===
            currentFilters.dateOfImmersion
          : true;
        const matchesOrganization = currentFilters.organizationName
          ? data.organizationName === currentFilters.organizationName
          : true;
        const filterStatus =
          data.isImmersed === true ? "Complete" : "Incomplete";
        const matchesStatus = filters.immpersionState
          ? filterStatus === filters.immpersionState
          : true;
        if (
          matchesType &&
          matchesSensitivity &&
          matchesDate &&
          matchesOrganization &&
          matchesStation &&
          matchesDivision &&
          matchesStatus
        ) {
          marker.addTo(mapInstance.current); // Show marker
        }
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

  useEffect(() => {
    if (filters.type != "organization") {
      setFilters((prevFilters) => ({ ...prevFilters, organizationName: "" }));
    }
  }, [filters.type]);

  const uniqueDates = [
    ...new Set(
      allIdols.map((idol) => new Date(idol.immersionDate).toLocaleDateString())
    ),
  ];
  useEffect(() => {
    filtersRef.current = filters;
    markersRef.current.forEach(({ marker, data }) => {
      const matchesType = filters.type
        ? data.typeOfInstaller === filters.type
        : true;
      const matchesSensitivity = filters.sensitivity
        ? data.sensitivity === filters.sensitivity
        : true;
      const matchesDate = filters.dateOfImmersion
        ? new Date(data.immersionDate).toLocaleDateString() ===
          filters.dateOfImmersion
        : true;
      const matchesOrganization = filters.organizationName
        ? data.organizationName === filters.organizationName
        : true;
      const filterStatus = data.isImmersed === true ? "Complete" : "Incomplete";
      const matchesStatus = filters.immpersionState
        ? filterStatus === filters.immpersionState
        : true;
      if (
        matchesType &&
        matchesSensitivity &&
        matchesDate &&
        matchesOrganization &&
        matchesStatus
      ) {
        marker.addTo(mapInstance.current); // Show marker
      } else {
        marker.remove(); // Hide marker
      }
    });
  }, [filters]);

  return (
    <>
      <div className="d-flex align-items-center map-filter-div my-2">
        <div className=" map-select-div my-2">
          <button className="btn btn-dark ms-2 me-2" onClick={onBackNav}>
            Back
          </button>
        </div>
        {showFilter && (
          <div className="row m-2">
            <div className="col-md-3 map-select-div">
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="form-select my-2"
              >
                <option value="">Select Type</option>
                <option value="private">Private</option>
                <option value="public">Private in public place</option>
                <option value="organization">
                  Organization in public place
                </option>
              </select>
            </div>
            <div className="col-md-3 map-select-div">
              {filters.type === "organization" && (
                <select
                  value={filters.organizationName}
                  onChange={(e) =>
                    setFilters({ ...filters, organizationName: e.target.value })
                  }
                  className="form-select my-2"
                >
                  <option value="">Select Type</option>
                  {station.defaultOrganization &&
                    station.defaultOrganization.map((org) => (
                      <option key={org}>{org}</option>
                    ))}
                </select>
              )}
            </div>
            <div className=" col-md-3  map-select-div">
              <select
                value={filters.sensitivity}
                onChange={(e) =>
                  setFilters({ ...filters, sensitivity: e.target.value })
                }
                className="form-select my-2"
              >
                <option value="">Select Sensitivity</option>
                <option value="Hyper-Sensitive">HyperSensitive</option>
                <option value="Sensitive">Sensitive</option>
                <option value="Nonsensitive">NonSensitive</option>
              </select>
            </div>

            <div className="col-md-3 my-2">
              <select
                id="statusSelect"
                className="form-select"
                value={filters.immpersionState}
                onChange={(e) =>
                  setFilters(() => ({
                    ...filters,
                    immpersionState: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="Complete">Immersion Complete</option>
                <option value="Incomplete">Immersion Incomplete</option>
              </select>
            </div>
            <div className="col-md-3 map-select-div">
              <select
                value={filters.dateOfImmersion}
                onChange={(e) =>
                  setFilters({ ...filters, dateOfImmersion: e.target.value })
                }
                className="form-select my-2"
              >
                <option value="">Select Date of Immersion</option>
                {uniqueDates.map((date, i) => (
                  <option value={date} key={i}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />
    </>
  );
};

export default StationMapView;
