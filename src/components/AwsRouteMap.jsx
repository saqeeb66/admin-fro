import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { LocationClient, CalculateRouteCommand } from "@aws-sdk/client-location";

export default function AwsRouteMap({ start, end }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style:
        "https://maps.geo.ap-south-1.amazonaws.com/maps/v0/maps/default/style-descriptor",
      center: [77.5946, 12.9716], // Bangalore default
      zoom: 6,
      transformRequest: (url) => ({
        url,
        headers: {
          "X-Amz-Api-Key": import.meta.env.VITE_AWS_LOCATION_KEY,
        },
      }),
    });

    const client = new LocationClient({
      region: "ap-south-1",
      credentials: {
        accessKeyId: "dummy",
        secretAccessKey: "dummy",
      },
    });

    async function drawRoute() {
      const cmd = new CalculateRouteCommand({
        CalculatorName: "default",
        DeparturePosition: start,
        DestinationPosition: end,
        TravelMode: "Car",
      });

      const res = await client.send(cmd);

      const coords = res.Legs[0].Geometry.LineString;

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#1E90FF",
            "line-width": 5,
          },
        });
      });
    }

    drawRoute();
    return () => map.remove();
  }, [start, end]);

  return (
    <div
      ref={mapRef}
      style={{ height: 350, borderRadius: 8 }}
    />
  );
}
