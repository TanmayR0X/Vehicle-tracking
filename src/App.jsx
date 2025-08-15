import { useEffect, useState, useRef } from "react";
import MapView from "./components/MapView";
import Controls from "./components/Controls";

export default function App() {
  const [latlngs, setLatlngs] = useState([]);
  const [routeSteps, setRouteSteps] = useState([]); // store distances & durations
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carSpeed, setCarSpeed] = useState(0);
  const [distanceLeft, setDistanceLeft] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");
  const intervalRef = useRef(null);

  const reverseGeocode = async (lat, lon, setter, type) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            "User-Agent": "MyReactApp/1.0 (your_email@example.com)",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch location");
      const data = await res.json();

      if (type === "start") {
        setter(data.address?.road || "Unknown Road");
      } else if (type === "end") {
        const destName =
          data.address?.road ||
          data.address?.neighbourhood ||
          data.address?.suburb ||
          data.address?.city ||
          "Unknown Destination";
        setter(destName);
      }
    } catch (err) {
      console.error(err);
      setter("Unknown location");
    }
  };

  useEffect(() => {
    async function fetchRoute() {
      const start = [17.385044, 78.486671];
      const end = [17.418, 78.5075];

      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&annotations=distance,duration`;
      const res = await fetch(url);
      const data = await res.json();

      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
      setLatlngs(coords);

      const distances = data.routes[0].legs[0].annotation.distance; // meters
      const durations = data.routes[0].legs[0].annotation.duration; // seconds
      const steps = distances.map((dist, i) => ({
        dist: dist / 1000, // km
        dur: durations[i], // sec
      }));
      setRouteSteps(steps);

      const totalDist = distances.reduce((a, b) => a + b, 0) / 1000;
      setTotalDistance(totalDist);
      setDistanceLeft(totalDist);

      reverseGeocode(start[0], start[1], setStartName, "start");
      reverseGeocode(end[0], end[1], setEndName, "end");
    }
    fetchRoute();
  }, []);

  useEffect(() => {
    if (isPlaying && latlngs.length > 0 && routeSteps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < latlngs.length - 1) {
            const segment = routeSteps[prev];
            if (segment && segment.dur > 0) {
              const kmh = (segment.dist / (segment.dur / 3600)); // km/h
              setCarSpeed(kmh);
            }

            let remaining = 0;
            for (let i = prev + 1; i < routeSteps.length; i++) {
              remaining += routeSteps[i].dist;
            }
            setDistanceLeft(remaining);

            return prev + 1;
          } else {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            setCarSpeed(0);
            setDistanceLeft(0);
            return 0;
          }
        });
      }, 1000 / speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, latlngs.length, routeSteps]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Controls
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      {latlngs.length > 0 && (
        <MapView
          latlngs={latlngs}
          currentIndex={currentIndex}
          traveledPath={latlngs.slice(0, currentIndex + 1)}
          speed={carSpeed}
          distanceLeft={distanceLeft}
          totalDistance={totalDistance}
          startName={startName}
          endName={endName}
        />
      )}
    </div>
  );
}
