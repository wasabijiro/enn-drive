// src/app/page.jsx
"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const response = await fetch("/api/location");
    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      // @ts-ignore
      setLocations(data);
    } else {
      console.error("Error fetching data: ", data.error);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const addLocation = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore
      const { latitude, longitude } = position.coords;
      const user_id = 1; // この user_id は例として使用されています。実際には認証されたユーザーのIDを使用してください。

      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error(`Error posting data: ${response.statusText}`);
      }

      const newLocation = await response.json();
      // @ts-ignore
      setLocations((currentLocations) => [...currentLocations, newLocation]);
    } catch (error) {
      console.error("Error adding location: ", error);
    }
  };

  const likeFunction = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore
      const { latitude, longitude } = position.coords;
      const user_id = 1; // こちらも addLocation と同様に実際のユーザーIDに置き換えてください。

      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });

      // レスポンスを確認
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error sending like: ", error);
    }
  };

  return (
    <div>
      <h1>Locations</h1>
      <button onClick={addLocation}>ロケーションを追加</button>
      <button onClick={likeFunction}>いいね</button>
      <ul>
        {locations.map((location) => {
          if (!location) return null;
          return (
            // @ts-ignore
            <li key={location.id}>
              {/* @ts-ignore */}
              {location.latitude}, {location.longitude}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
