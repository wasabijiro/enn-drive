// src/app/page.jsx
"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("/api/location");
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error("Error fetching data: ", data.error);
      }
    };

    fetchLocations();
  }, [locations]);

  const addLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const user_id = 1;

      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });

      if (!response.ok) {
        console.error("Error posting data: ", response.statusText);
      } else {
        const newLocation = await response.json();
        setLocations((locations) => [...locations, newLocation]); // newLocationがオブジェクトであると想定
      }
    });
  };

  return (
    <div>
      <h1>Locations</h1>
      <button onClick={addLocation}>ロケーションを追加</button>
      <ul>
        {locations.map((location) => {
          if (!location) return null; // locationがnullまたはundefinedの場合は何も描画しない
          return (
            <li key={location.id}>
              {location.latitude}, {location.longitude}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
