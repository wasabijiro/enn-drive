// hooks/useApi.ts

import formatCreatedAt from "@/utils/formatDate";
import sendLikes from "./sendLikes";

// @ts-ignore
export const useApi = (user_id, getCurrentPosition, account) => {
  // @ts-ignore
  const apiRequest = async (endpoint, options) => {
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
  // @ts-ignore
  const addLocation = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore
      const { latitude, longitude } = position.coords;
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
  // @ts-ignore
  const likeFunction = async () => {
    try {
      const position = await getCurrentPosition();
      // @ts-ignore
      const { latitude, longitude } = position.coords;
      sendLikes(user_id, latitude, longitude, account);
    } catch (error) {
      console.error("Error sending like: ", error);
    }
  };
  // @ts-ignore
  const fetchTotalTokens = async (
    // @ts-ignore
    sumToken,
    // @ts-ignore
    toggleHeart,
    // @ts-ignore
    setSumToken,
    // @ts-ignore
    setLastDate,
    // @ts-ignore
    setGeo
  ) => {
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
        // @ts-ignore
        setLastDate(formatCreatedAt(latestLike.latest_created_at));
        // @ts-ignore
        setGeo({
          lat: latestLike.latest_latitude,
          lon: latestLike.latest_longitude,
        });
      }
    } catch (error) {
      console.error("Fetching total tokens failed:", error);
    }
  };

  // @ts-ignore
  const fetchPlaceName = async (geo, setPlaceName) => {
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
