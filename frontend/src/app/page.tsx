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
import { useLocalStorage } from "usehooks-ts";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { suiClient } from "@/config/sui";
import { getOwnedDriveObjectId } from "@/utils/getObject";
import { NFT_TYPE } from "@/config";
// import {　ReactComponent as HundleIcon } from "./hundle.svg";
import { shortenAddress } from "@/utils";
import { NETWORK } from "@/config/sui";

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
  const [mintDigest] = useLocalStorage<string | null>("mint-digest", null);
  const [liked, setLiked] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

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
  };

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
      }, 3000);
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
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);
    console.log(zkLoginSetup.userAddr);
    if (zkLoginSetup.userAddr) {
      setUser_id(zkLoginSetup.userAddr);
      getNFTObjectid();
    }
    fetchTotalTokens(sumToken, setHeart, setSumToken, setLastDate, setGeo);
    return () => clearTimeout(timer);
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
  }, [heart]);

  const handleClick = () => {
    setOpen(true);
    // likeFunction(zkLoginSetup.account);
    likeFunction(account);
    setLiked(true);
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
            <p>
              object-id:
              <a
                style={{ color: "#0000EE" }}
                className="mx-1 underline decoration-solid"
                href={`https://suiscan.xyz/${NETWORK}/object/${object_id}`}
              >
                {shortenAddress(object_id)}
              </a>
            </p>
          )}
          {/* <p className="text-center text-bold text-2xl">Likes:<span className="mx-2">{sumToken}</span></p> */}
        </div>
      </div>
      <button
        className="w-full bg-rose-400 text-white mt-4 text-3xl py-3 rounded-lg shadow-md"
        onClick={handleClick}
      >
        いいね
        <FontAwesomeIcon className="mx-2" icon={faHeart} />
      </button>
      {mintDigest && showMessage && (
        <div
          className={`flex flex-row gap-2 border border-light-green-300 p-2 mt-2`}
        >
          <p>Mint Success! Tx Hash:</p>
          <p>
            <a
              style={{ color: "#0000EE" }}
              className="mx-1 underline decoration-solid"
              href={`https://suiscan.xyz/${NETWORK}/tx/${mintDigest}`}
            >
              {shortenAddress(mintDigest)}
            </a>
          </p>
        </div>
      )}
      {liked && (
        <div
          className={`flex flex-row gap-2 border border-light-green-300 p-2 mt-2`}
        >
          <p>Like Success! Tx Account:</p>
          <p>
            <a
              style={{ color: "#0000EE" }}
              className="mx-1 underline decoration-solid"
              href={`https://suiscan.xyz/${NETWORK}/account/${zkLoginSetup.userAddr}`}
            >
              {shortenAddress(zkLoginSetup.userAddr)}
            </a>
          </p>
        </div>
      )}
      <div className="flex justify-between align-center bg-slate-50 h-18 fixed bottom-0 w-full p-2">
        <div className="text-center align-center w-32">
          <span>
            <FontAwesomeIcon icon={faWallet} size="2x" />
            <span className="mx-2">{sumToken}</span>
          </span>
          {zkLoginSetup.userAddr && (
            <p>
              <a
                style={{ color: "#0000EE" }}
                className="mx-1 underline decoration-solid"
                href={`https://suiscan.xyz/${NETWORK}/account/${zkLoginSetup.userAddr}`}
              >
                {shortenAddress(zkLoginSetup.userAddr)}
              </a>
            </p>
          )}
        </div>
        <div className="text-center align-center w-32">
          <FontAwesomeIcon size="2x" icon={faGear} />
          <p>設定</p>
        </div>
      </div>
      <div
        onClick={togglePlay}
        style={{ bottom: "-4px" }}
        className={`w-28 h-28 fixed rounded-full flex justify-center items-center ${
          !play ? "bg-lime-600" : "bg-red-600"
        }`}
      >
        {!play ? (
          <img alt="" className="w-20 h-20" src="/hundle.svg" />
        ) : (
          <FontAwesomeIcon
            className="text-white"
            icon={faTrafficLight}
            size="5x"
          />
        )}
      </div>
    </div>
  );
};

export default LikeScreen;
