import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function FitToRoute({ latlngs }) {
  const map = useMap();
  useEffect(() => {
    if (latlngs.length > 1) {
      const poly = L.polyline(latlngs);
      map.fitBounds(poly.getBounds(), { padding: [24, 24] });
    }
  }, [latlngs, map]);
  return null;
}
