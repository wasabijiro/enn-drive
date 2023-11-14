"use client";

import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Account, OpenIdProvider } from "@/types";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { moveCallSponsored } from "@/libs/sponsoredZkLogin";
import { shortenAddress } from "@/utils";
import { ZKLOGIN_ACCONTS, openIdProviders } from "@/config";
import { NETWORK } from "@/config/sui";
import style from "@/app/styles/login.module.css";
import { styles } from "@/app/styles";
import googleAnimationData from "@/components/interface/animations/google.json";
import { useLottie } from "@/utils/useLottie";
import { suiClient } from "@/config/sui";
import { getOwnedCocoObjectId } from "@/utils/getObject";

export default function Home() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string>("");
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
    const getObject = async () => {
      const obj_id = await getOwnedCocoObjectId(
        "0x96fc41bb935336e9ece2f894518b47da0ad5318f6064a912fe0daede453f2f8c"
      );

      const field: any = await suiClient.getObject({
        id: obj_id,
        options: {
          showContent: true,
          showType: true,
        },
      });

      console.log({ field });
    };
    getObject();
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

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={styles.compose}
    >
      <div style={styles.contentTop}>
        <p
          className={`${style.mySpecialFont} text-right text-black text-xl mr-5`}
        >
          Sui {NETWORK === "testnet" ? "Testnet" : "Mainnet"}
        </p>
        <p
          className={`${style.mySpecialFont} text-center text-black text-4xl mt-5`}
        >
          Sui POAP
        </p>
        <p
          className={`${style.mySpecialFont} mt-5 text-center text-black text-3xl font-bold leading-9`}
        >
          <span className="text-2xl">by</span> zkLogin & Sponsored Transaction,
          <br />
        </p>
        <p
          className={`${style.mySpecialFont} flex items-center justify-center mt-3 text-center text-black text-3xl font-bold leading-9 gap-2`}
        >
          <span className="text-2xl">presented by</span> Umi Labs
          <img
            src="/logo.png"
            alt="Umi Labs Logo"
            style={{ height: "1.25em" }}
          />
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-screen mb-10">
        <div
          id="login-buttons"
          className="section flex mb-10 items-center justify-center"
        >
          {openIdProviders.map((provider) => (
            <button
              className={`btn-login text-black font-bold py-1 px-10 rounded border-[2px] border-gray-300 ${provider} mt-5`}
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
