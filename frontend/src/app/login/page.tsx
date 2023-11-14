"use client";

import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Account, OpenIdProvider } from "@/types";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { moveCallSponsored } from "@/libs/sponsoredZkLogin";
import { shortenAddress } from "@/utils";
import { ZKLOGIN_ACCONTS } from "@/config";
import { NETWORK } from "@/config/sui";
import style from "@/styles/login.module.css";
import { styles } from "@/styles";
import googleAnimationData from "@/components/interface/animations/google.json";
import { useLottie } from "@/utils/useLottie";

export default function Home() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(
    ZKLOGIN_ACCONTS,
    null
  );
  const { container: googleAnimationContainer } = useLottie(
    googleAnimationData,
    true
  );
  const zkLoginSetup = useZkLoginSetup();

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
  }, []);

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  const beginZkLogin = async (provider: OpenIdProvider) => {
    setModalContent(`🔑 Logging in with ${provider}...`);

    await zkLoginSetup.beginZkLogin(provider);
    console.log(zkLoginSetup.account());
    setAccount(zkLoginSetup.account());
    console.log(zkLoginSetup.userAddr);
    const loginUrl = zkLoginSetup.loginUrl();
    window.location.replace(loginUrl);
  };

  const openIdProviders: OpenIdProvider[] = [
    "Google",
    // "Twitch",
    // "Facebook",
  ];

  const status = () => {
    if (!zkLoginSetup.userAddr) {
      return "Not signed in";
    }

    if (!zkLoginSetup.zkProofs && zkLoginSetup.isProofsLoading) {
      return "Generating zk proof...";
    }

    return "Ready!";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-3">
      <div className="p-6 max-w-sm w-90 bg-white shadow-md rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={"/like.png"} />
        <h1 className="text-xl font-bold text-center mb-1 mt-2">enn-Drive</h1>
        <p className="text-center mb-2 font-bold">Drive Safe, Earn Likes.</p>
        <div
          id="login-buttons"
          className="section mb-2 flex items-center justify-center"
        >
          {openIdProviders.map((provider) => (
            <button
              className={`btn-login text-black font-bold py-1 px-10 rounded border-[2px] border-gray-300 ${provider}`}
              onClick={() => {
                beginZkLogin(provider);
              }}
              key={provider}
            >
              <div className="flex items-center">
                <div
                  className="max-w-[50px]"
                  ref={googleAnimationContainer}
                ></div>
                <div className="mr-5 text-lg">Login with {provider}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
