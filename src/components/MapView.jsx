import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import carImg from "../assets/car.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { useState } from "react";
import InfoPanel from "./InfoPanel";
import RotatingMarker from "./RotatingMarker";

// Car icon
const carIcon = new L.Icon({
  iconUrl: carImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Destination marker (React Icon -> HTML -> DivIcon)
const destinationIcon = new L.DivIcon({
  html: renderToStaticMarkup(<FaMapMarkerAlt color="red" size={28} />),
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const getBearing = (from, to) => {
  const lat1 = (from[0] * Math.PI) / 180;
  const lon1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const lon2 = (to[1] * Math.PI) / 180;
  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let brng = Math.atan2(y, x);
  brng = (brng * 180) / Math.PI;
  return (brng + 360) % 360;
};

// Map type definitions
const mapTypes = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
};

export default function MapView({
  latlngs,
  currentIndex,
  traveledPath,
  speed,
  distanceLeft,
  totalDistance,
  startName,
  endName,
}) {
  const start = latlngs[0] ?? [0, 0];
  const end = latlngs[latlngs.length - 1] ?? [0, 0];
  const [panelVisible, setPanelVisible] = useState(false);
  const [mapType, setMapType] = useState('standard');

  const rotationAngle =
    latlngs[currentIndex + 1]
      ? getBearing(latlngs[currentIndex], latlngs[currentIndex + 1])
      : 0;

  return (
    <>
      <MapContainer
        center={start}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution=""
          url={mapTypes[mapType].url}
        />

        {/* Dropdown menu to select map type with Tailwind CSS */}
        <select
          onChange={(e) => setMapType(e.target.value)}
          value={mapType}
          className="z-1000 absolute top-4 right-4 p-2 pl-4 pr-10 border-2 border-gray-300 rounded-md bg-white text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="standard">Standard</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
        </select>

        {/* Full route */}
        {latlngs.length > 1 && (
          <Polyline positions={latlngs} color="gray" weight={3} />
        )}

        {/* Traveled path */}
        {traveledPath.length > 1 && (
          <Polyline positions={traveledPath} color="blue" weight={5} />
        )}

        {/* Moving car */}
        {latlngs[currentIndex] && (
          <RotatingMarker
            position={latlngs[currentIndex]}
            icon={carIcon}
            rotationAngle={rotationAngle}
            onClick={() => setPanelVisible((v) => !v)}
          />
        )}

        {/* Destination marker */}
        {latlngs.length > 1 && (
          <Marker position={end} icon={destinationIcon} />
        )}
      </MapContainer>

      <InfoPanel
        visible={panelVisible}
        onClose={() => setPanelVisible(false)}
        speed={speed}
        start={start}
        end={end}
        startName={startName}
        endName={endName}
        distanceLeft={distanceLeft}
        totalDistance={totalDistance}
      />
    </>
  );
}