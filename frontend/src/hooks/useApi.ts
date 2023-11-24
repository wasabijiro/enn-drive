// hooks/useApi.ts

import formatCreatedAt from "@/utils/formatDate";
import sendLikes from "./sendLikes";

export const useApi = (user_id: any, getCurrentPosition: any) => {
  const apiRequest = async (endpoint: any, options: any) => {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.statusText}`);
    }
    return response.json();
  };
  const addLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      console.log({ latitude, longitude })
      const newLocation = await apiRequest("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
      if (!newLocation || !("id" in newLocation)) {
        throw new Error("Invalid location data");
      }
    } catch (error) {
      console.error("Error adding location: ", error);
    }
  };
  const likeFunction = async (account: any) => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      sendLikes(user_id, latitude, longitude, account);
    } catch (error) {
      console.error("Error sending like: ", error);
    }
  };
  const fetchTotalTokens = async (sumToken: any, toggleHeart: any, setSumToken: any, setLastDate: any, setGeo: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/getLikeInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taker_id: user_id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.length > 0) {
        const latestLike = responseData[0];
        if (sumToken && sumToken != latestLike.total_tokens) {
          toggleHeart();
        }
        setSumToken(latestLike.total_tokens);
        setLastDate(formatCreatedAt(latestLike.latest_created_at));
        setGeo({ lat: latestLike.latest_latitude, lon: latestLike.latest_longitude, });
      }
    } catch (error) {
      console.error("Fetching total tokens failed:", error);
    }
  };

  const fetchPlaceName = async (geo:any, setPlaceName:any) => {
    if (geo.lat && geo.lon) {
      try {
        const response = await fetch("http://localhost:3000/api/getPlaceName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geo),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json(); // 応答をJSONとしてパース
        if (responseData) {
          setPlaceName(responseData.neighbourhood);
        }
      } catch (error) {
        console.error("Fetching place name failed:", error);
      }
    }
  };
  return { addLocation, likeFunction, fetchTotalTokens, fetchPlaceName };
};
