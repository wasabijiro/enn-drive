"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  // @ts-ignore
  async function apiRequest(endpoint, options = {}) {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        // @ts-ignore
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  }

  const fetchLocations = async () => {
    try {
      const data = await apiRequest("/api/location");
      if (Array.isArray(data)) {
        // @ts-ignore
        setLocations(data.filter(location => location != null && 'id' in location));
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const addLocation = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore

      const { latitude, longitude } = position.coords;
      const user_id = 1;

      const newLocation = await apiRequest("/api/location", {
        method: "POST",
        body: JSON.stringify({ user_id, latitude, longitude }),
      });

      if (newLocation && 'id' in newLocation) {
        // @ts-ignore

        setLocations((currentLocations) => [...currentLocations, newLocation]);
      } else {
        throw new Error("Invalid location data");
      }
    } catch (error) {
      console.error("Error adding location: ", error);
    }
  };


  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const likeFunction = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore

      const { latitude, longitude } = position.coords;
      const user_id = 2;

      await apiRequest("/api/like", {
        method: "POST",
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
    } catch (error) {
      console.error("Error sending like: ", error);
    }
  };

  return (
    <div>
      <h1>Locations</h1>
      <div>
        <button onClick={addLocation}>ロケーションを追加</button>
      </div>
      <div>
        <button onClick={likeFunction}>いいね</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ユーザーID</th>
            <th>緯度</th>
            <th>経度</th>
            <th>作成日時</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr key={index}>
              {/* @ts-ignore */}
              <td>{location.id}</td>
              {/* @ts-ignore */}
              <td>{location.user_id}</td>
              {/* @ts-ignore */}
              <td>{location.latitude}</td>
              {/* @ts-ignore */}
              <td>{location.longitude}</td>
              {/* @ts-ignore */}
              <td>{new Date(location.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}