"use client";
import React from "react";
import { useState, useEffect } from "react";
import getCurrentPosition from "@/hooks/usePosition";
import { useApi } from "@/hooks/useApi";

export default function Page() {
  // const [locations, setLocations] = useState([]);
  const [user_id, setUser_id] = useState("1"); // user_id ステートの追加
  const { addLocation, likeFunction } = useApi(user_id, getCurrentPosition);
  useEffect(() => {
    const intervalId = setInterval(() => {
      addLocation(); // 15秒ごとにこの関数を実行
    }, 15000); // 15000ミリ秒 = 15秒

    return () => clearInterval(intervalId); // コンポーネントのアンマウント時にインターバルをクリア
    // @ts-ignore
  }, [user_id]); // user_idが変更された時にもインターバルを再設定

  // @ts-ignore
  const handleuser_idChange = (event) => {
    setUser_id(event.target.value); // user_id の更新
  };

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

  // const fetchLocations = async () => {
  //   try {
  //     const data = await apiRequest("/api/location");
  //     if (Array.isArray(data)) {
  //       // @ts-ignore
  //       // setLocations(data.filter(location => location != null && 'id' in location));
  //     } else {
  //       throw new Error("Invalid data format");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  // const addLocation = async () => {
  //   try {
  //     const position = await getCurrentPosition();
  //     // @ts-ignore
  //     const { latitude, longitude } = position.coords;
  //     console.log({ latitude, longitude, user_id });
  //     const newLocation = await apiRequest("/api/location", {
  //       method: "POST",
  //       body: JSON.stringify({ user_id, latitude, longitude }), // user_id を使用
  //     });
  //     if (newLocation && "id" in newLocation) {
  //       console.log("added");
  //       // @ts-ignore
  //       // setLocations((currentLocations) => [...currentLocations, newLocation]);
  //     } else {
  //       throw new Error("Invalid location data");
  //     }
  //   } catch (error) {
  //     console.error("Error adding location: ", error);
  //   }
  // };

  // const likeFunction = async () => {
  //   try {
  //     const position = await getCurrentPosition();
  //     // @ts-ignore
  //     const { latitude, longitude } = position.coords;
  //     await apiRequest("/api/like", {
  //       method: "POST",
  //       body: JSON.stringify({ user_id: user_id, latitude, longitude }), // user_id を使用
  //     });
  //   } catch (error) {
  //     console.error("Error sending like: ", error);
  //   }
  // };

  return (
    <div className="flex h-screen justify-center items-center relative">
      <input
        type="text"
        value={user_id} // input の value を user_id に設定
        onChange={handleuser_idChange} // input の変更をハンドル
        className="absolute top-0 left-0 m-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={likeFunction}
        className="bg-pink-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
      >
        いいね
      </button>
    </div>
  );
}
