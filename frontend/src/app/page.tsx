"use client";
import {
  faCar,
  faGear,
  faHeart,
  faHouse,
  faPlay,
  faStop,
  faTrafficLight,
  faTrophy,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { suiClient } from "@/config/sui";
import { getOwnedDriveObjectId } from "@/utils/getObject";
import { NFT_TYPE } from "@/config";
// import {　ReactComponent as HundleIcon } from "./hundle.svg";
import { shortenAddress } from "@/utils";

import formatCreatedAt from "@/utils/formatDate";

import Snackbar from "@mui/material/Snackbar";
import HeartAnimation from "@/app/heart/page";

import { useApi } from "@/hooks/useApi";
import getCurrentPosition from "@/hooks/usePosition";
import { SvgIcon } from "@mui/material";
import { moveCallSponsoredLike } from "@/libs/sponsoredZkLogin";

const LikeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [play, setPlay] = useState(false);
  const [open, setOpen] = useState(false);
  const [sumToken, setSumToken] = useState(0);
  const [lastDate, setLastDate] = useState(null);
  const [geo, setGeo] = useState({ lat: null, lon: null });
  const [placeName, setPlaceName] = useState("Tokyo");
  const [heart, setHeart] = useState(false);
  const [user_id, setUser_id] = useState<string | null>(null);
  const [object_id, setObject_id] = useState<string | null>(null);
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

  const getNFTObjectid = async () => {
    const obj_id = await getOwnedDriveObjectId(zkLoginSetup.userAddr, NFT_TYPE);
    const field: any = await suiClient.getObject({
      id: obj_id,
      options: {
        showContent: true,
        showType: true,
      },
    });
    const nft_id = field.data?.content.fields.nft;
    setObject_id(nft_id);
  }

  useEffect(() => {
    let intervalId: any;
    if (play) {
      intervalId = setInterval(() => {
        console.log("send");
        addLocation();
        fetchTotalTokens(
          sumToken,
          setHeart,
          setSumToken,
          setLastDate,
          setGeo
        )
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
  }, [addLocation, fetchTotalTokens, play, sumToken]);

  useEffect(() => {
    console.log(zkLoginSetup.userAddr);
    if (zkLoginSetup.userAddr) {
      setUser_id(zkLoginSetup.userAddr);
      getNFTObjectid();
    }
    fetchTotalTokens(sumToken, setHeart, setSumToken, setLastDate, setGeo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchPlaceName(geo, setPlaceName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  useEffect(() => {
    setTimeout(() => {
      setHeart(false);
    }, 10000);
  }, [heart])

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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-3">
      {heart && <HeartAnimation />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        // message="You spread the likes around!"
        message={heart ? "いいねされました！" : "いいねの縁を広げました！"}
        key={"top,center"}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "white", // 背景色を白に設定
            color: "black", // テキストの色を黒に設定
          },
        }}
      />
      <div className="p-6 max-w-sm w-90 bg-white shadow-md rounded-lg border-2 shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rounded-lg" alt="" src={"/mazdacar.png"} />
        <div className="w-full rounded-lg bg-slate-100 mt-3 py-2 text-center">
          {object_id && (
            <p>object-id:<span style={{ color: "#0000EE" }} className="mx-1 underline decoration-solid">{shortenAddress(object_id)}</span></p>
          )}
          {/* <p className="text-center text-bold text-2xl">Likes:<span className="mx-2">{sumToken}</span></p> */}

        </div>
      </div>
      <button className="w-full bg-rose-400 text-white mt-4 text-3xl py-3 rounded-lg shadow-md" onClick={handleClick}>Like<FontAwesomeIcon className="mx-2" icon={faHeart} /></button>
      <div className="flex justify-between align-center bg-slate-50 h-18 fixed bottom-0 w-full p-2">
        <div className="text-center align-center w-32">
          <span><FontAwesomeIcon icon={faWallet} size="2x" /><span className="mx-2">{sumToken}</span></span>
          {zkLoginSetup.userAddr && (
            <p><span style={{ color: "#0000EE" }} className="mx-1 underline decoration-solid">{shortenAddress(zkLoginSetup.userAddr)}</span></p>
          )}
        </div>
        <div className="text-center align-center w-32">
          <FontAwesomeIcon size="2x" icon={faGear} />
          <p>設定</p>
        </div>
      </div>
      <div onClick={togglePlay} style={{ bottom: "-4px" }} className={`w-28 h-28 fixed rounded-full flex justify-center items-center ${!play ? "bg-lime-600" : "bg-red-600"}`}>
        {!play ? <img alt="" className="w-20 h-20" src="/hundle.svg" /> :
          <FontAwesomeIcon className="text-white" icon={faTrafficLight} size="5x" />}
      </div>
    </div>
    // <div className="bg-gray-100  h-screen flex justify-center items-center">
    //   <div className="p-3 mx-3 max-w-sm w-full bg-white shadow-md rounded-md z-10">
    //     <div className="flex justify-center my-4">
    //       <div className="relative w-64 h-64">
    //         <div
    //           className="w-full h-full rounded-full shadow-md"
    //           style={styles.outerRingStyle}
    //         ></div>
    //         <div className="absolute top-2 left-2 w-60 h-60 bg-white rounded-full flex items-center justify-center">
    //           <div>
    //             <p className="text-lg font-semibold text-center">{surplus}%</p>
    //             <p className="text-center text-sm text-center">
    //               Total Likes: {intToken}
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="text-center text-xs my-4">
    //       <p>Last Like: {lastDate}</p>
    //       <p>Location: {placeName}</p>
    //     </div>
    //     <div className="flex justify-center mt-4">
    //       <button
    //         className={`text-slate-50 h-12 justify-center align-center me-5 rounded ${!play ? "bg-sky-500" : "bg-red-500"
    //           }`}
    //         onClick={togglePlay}
    //       >
    //         {!play ? (
    //           <p>運転を開始する</p>
    //           // <FontAwesomeIcon icon={faCar} size={"xl"} />
    //         ) : (
    //           <p>運転を止める</p>
    //           // <FontAwesomeIcon icon={faStop} size={"xl"} />
    //         )}
    //       </button>
    //       <button
    //         style={styles.buttonStyle}
    //         onClick={handleClick}
    //         className="h-12"
    //       >
    //         <span className="font-extrabold text-lg">Like</span>
    //         <FontAwesomeIcon icon={faHeart} className="ms-2" size={"xl"} />
    //       </button>
    //     </div>
    //   </div>
    //   <div id="navbar" className="fixed bottom-0 left-0 right-0">
    //     <div className="bg-gray-800 text-white flex justify-evenly">
    //       <button
    //         className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "home" ? "bg-gray-700" : ""
    //           }`}
    //         onClick={() => setSelectedTab("home")}
    //       >
    //         <FontAwesomeIcon icon={faHouse} size={"xl"} className="mb-1" />
    //         <span className="text-xs">Home</span>
    //       </button>
    //       <button
    //         className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "trophy" ? "bg-gray-700" : ""
    //           }`}
    //         onClick={() => setSelectedTab("trophy")}
    //       >
    //         <FontAwesomeIcon icon={faTrophy} size={"xl"} className="mb-1" />
    //         <span className="text-xs">Trophy</span>
    //       </button>
    //       <button
    //         className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === "settings" ? "bg-gray-700" : ""
    //           }`}
    //         onClick={() => setSelectedTab("settings")}
    //       >
    //         <FontAwesomeIcon icon={faGear} size={"xl"} className="mb-1" />
    //         <span className="text-xs">Settings</span>
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default LikeScreen;
