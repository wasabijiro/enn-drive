"use client";
import {
  faCar,
  faGear,
  faHeart,
  faHouse,
  faPlay,
  faStop,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { suiClient } from "@/config/sui";
import { getOwnedDriveObjectId } from "@/utils/getObject";
import { NFT_TYPE } from "@/config";

import formatCreatedAt from "@/utils/formatDate";

import Snackbar from "@mui/material/Snackbar";
import HeartAnimation from "@/app/heart/page";

import { useApi } from "@/hooks/useApi";
import getCurrentPosition from "@/hooks/usePosition";

const LikeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [play, setPlay] = useState(false);
  const [open, setOpen] = useState(false);
  const [sumToken, setSumToken] = useState(null);
  const [surplus, setSurplus] = useState(0);
  const [intToken, setIntToken] = useState(0);
  const [lastDate, setLastDate] = useState(null);
  const [geo, setGeo] = useState({ lat: null, lon: null });
  const [placeName, setPlaceName] = useState("Tokyo");
  const [heart, setHeart] = useState(false);
  const [user_id, setuser_id] = useState<string | null>(null);
  const zkLoginSetup = useZkLoginSetup();

  const { addLocation, likeFunction, fetchTotalTokens, fetchPlaceName } =
    useApi(user_id, getCurrentPosition);

    const account = {
      provider: zkLoginSetup.provider,
      userAddr: zkLoginSetup.userAddr,
      zkProofs: zkLoginSetup.zkProofs,
      ephemeralPublicKey: zkLoginSetup.ephemeralPublicKey,
      ephemeralPrivateKey: zkLoginSetup.ephemeralPrivateKey,
      userSalt: zkLoginSetup.salt(),
      jwt: zkLoginSetup.jwt,
      sub: zkLoginSetup.sub,
      aud: zkLoginSetup.aud,
      maxEpoch: zkLoginSetup.maxEpoch,
      randomeness: zkLoginSetup.randomness,
    };

  useEffect(() => {
    let intervalId: any;
    if (play) {
      intervalId = setInterval(() => {
        console.log("send");
        addLocation();
        fetchTotalTokens(
          sumToken,
          toggleHeart,
          setSumToken,
          setLastDate,
          setGeo
        );
      }, 15000);
    } else {
      console.log("not send");
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  useEffect(() => {
    console.log("b");
    console.log(zkLoginSetup.userAddr);
    if (zkLoginSetup.userAddr) {
      console.log("a");
      setuser_id(zkLoginSetup.userAddr);
    }
    const get_id = async () => {
      const obj_id = await getOwnedDriveObjectId(
        zkLoginSetup.userAddr,
        NFT_TYPE
      );
      const field: any = await suiClient.getObject({
        id: obj_id,
        options: {
          showContent: true,
          showType: true,
        },
      });

      console.log({ field });

      const nft_id = field.data?.content.fields.nft;

      console.log({ nft_id });
    };
    get_id();
    fetchTotalTokens(sumToken, toggleHeart, setSumToken, setLastDate, setGeo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPlaceName(geo, setPlaceName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  useEffect(() => {
    setSurplus(sumToken ? Math.floor((sumToken % 1) * 100) : 0);
    setIntToken(sumToken ? Math.floor(sumToken) : 0);
  }, [sumToken]);
  const styles = {
    outerRingStyle: {
      background: `conic-gradient(
        #00bfff ${surplus * 3.6}deg,
        transparent ${surplus * 3.6}deg 360deg
        )`,
    },
    buttonStyle: {
      backgroundColor: "#ff69b4",
      color: "white",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
    },
  };

  const toggleHeart = () => {
    setHeart(true);
    setTimeout(() => {
      setHeart(false);
    }, 10000);
  };

  const handleClick = () => {
    setOpen(true);
    // likeFunction(zkLoginSetup.account);
    likeFunction(account);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  return (
    <div className="bg-gray-100  h-screen flex justify-center items-center">
      {heart && <HeartAnimation />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        // message="You spread the likes around!"
        message="You spread an enn of likes!"
        key={"top,center"}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "white", // 背景色を白に設定
            color: "black", // テキストの色を黒に設定
          },
        }}
      />
      <div className="p-3 mx-3 max-w-sm w-full bg-white shadow-md rounded-md z-10">
        <div className="flex justify-center my-4">
          <div className="relative w-64 h-64">
            <div
              className="w-full h-full rounded-full shadow-md"
              style={styles.outerRingStyle}
            ></div>
            <div className="absolute top-2 left-2 w-60 h-60 bg-white rounded-full flex items-center justify-center">
              <div>
                <p className="text-lg font-semibold text-center">{surplus}%</p>
                <p className="text-center text-sm text-center">
                  Total Likes: {intToken}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs my-4">
          <p>Last Like: {lastDate}</p>
          <p>Location: {placeName}</p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className={`text-slate-50 h-12 justify-center align-center me-5 rounded ${!play ? "bg-sky-500" : "bg-red-500"
              }`}
            onClick={togglePlay}
          >
            {!play ? (
              <p>運転を開始する</p>
              // <FontAwesomeIcon icon={faCar} size={"xl"} />
            ) : (
              <p>運転を止める</p>
              // <FontAwesomeIcon icon={faStop} size={"xl"} />
            )}
          </button>
          <button
            style={styles.buttonStyle}
            onClick={handleClick}
            className="h-12"
          >
            <span className="font-extrabold text-lg">Like</span>
            <FontAwesomeIcon icon={faHeart} className="ms-2" size={"xl"} />
          </button>
        </div>
      </div>
      <div id="navbar" className="fixed bottom-0 left-0 right-0">
        <div className="bg-gray-800 text-white flex justify-evenly">
          <button
            className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "home" ? "bg-gray-700" : ""
              }`}
            onClick={() => setSelectedTab("home")}
          >
            <FontAwesomeIcon icon={faHouse} size={"xl"} className="mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "trophy" ? "bg-gray-700" : ""
              }`}
            onClick={() => setSelectedTab("trophy")}
          >
            <FontAwesomeIcon icon={faTrophy} size={"xl"} className="mb-1" />
            <span className="text-xs">Trophy</span>
          </button>
          <button
            className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "settings" ? "bg-gray-700" : ""
              }`}
            onClick={() => setSelectedTab("settings")}
          >
            <FontAwesomeIcon icon={faGear} size={"xl"} className="mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeScreen;
