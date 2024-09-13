import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map_style.css";
import liveMarker from "/pinimg2.png";
// Custom Icons
// import icon1Image from "./icons/icon1.png"; // Replace with your own image paths
// import icon2Image from "./icons/icon2.png";

// Define custom icons
// const icon1 = new L.Icon({
//   iconUrl: icon1Image,
//   iconSize: [32, 32], // size of the icon
//   iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
// });

// const icon2 = new L.Icon({
//   iconUrl: icon2Image,
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: liveMarker,
  shadowUrl: markerShadow,
  iconSize: [54, 54],
  iconAnchor: [16, 32],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MyMapComponent = ({ locations, onBackNav }) => {
  console.log(locations);

  let locationsData = [];
  if (Array.isArray(locations)) {
    locationsData = locations;
  }

  return (
    <>
      <button
        className="btn btn-dark live__track__back__btn"
        onClick={onBackNav}
      >
        Back
      </button>
      <MapContainer
        className="map"
        center={[11.229592, 78.171158]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      /> */}

        {/* Esri World Imagery Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
          maxZoom={18}
          opacity={1}
        />

        {/* Esri World Transportation Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, NAVTEQ"
          maxZoom={18}
          opacity={1}
        />

        {/* Esri World Boundaries and Places Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, HERE, DeLorme, USGS, Intermap, increment P Corp."
          maxZoom={18}
          opacity={1}
        />
        {locationsData.map((user, i) => (
          <Marker position={[user.data.loc.lat, user.data.loc.lon]} key={i}>
            <Popup>
              <b>Station : </b> {user.data.stationName}
              <br />
              <b>Idol : </b> {user.data.idolId}
              <br />
              <b>Name : </b>
              {user.data.name}
              <br />
              <b> Start Point : </b>
              {user.data.startingPoint}
              <br />
              <b> End Point : </b>
              {user.data.endingPoint}
            </Popup>
          </Marker>
        ))}
        {/* Marker with custom icon1 */}
        {/* <Marker position={[11.676786, 78.054522]}>
        <Popup>This is marker with custom icon 1.</Popup>
      </Marker> */}
        {/* Marker with custom icon2 */}
        {/* <Marker position={[11.776786, 78.254522]}>
        <Popup>This is marker with custom icon 2.</Popup>
      </Marker> */}
      </MapContainer>
    </>
  );
};

export default MyMapComponent;
