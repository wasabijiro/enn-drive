"use client";

import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Account, OpenIdProvider } from "@/types";
import { useZkLoginSetup } from "@/libs/store/zkLogin";
import { moveCallSponsoredMint } from "@/libs/sponsoredZkLogin";
import { shortenAddress } from "@/utils";
import { ZKLOGIN_ACCONTS } from "@/config";
import { NETWORK } from "@/config/sui";
import style from "@/styles/login.module.css";
import { styles } from "@/styles";
import { driveObjectType } from "@/config";
import { moveCallSponsoredLike } from "@/libs/sponsoredZkLogin";

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
  const zkLoginSetup = useZkLoginSetup();
  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
  }, []);

  const status = () => {
    if (!zkLoginSetup.userAddr) {
      return "Not signed in";
    }

    if (!zkLoginSetup.zkProofs && zkLoginSetup.isProofsLoading) {
      return "Generating zk proof...";
    }

    return "Ready!";
  };

  // const movecall = async () => {
  //   const txb = new TransactionBlock();
  //   const result = await moveCallSponsoredLike(
  //     txb,
  //     zkLoginSetup.account(),
  //     "0x43ea6b4feb9cf61ae6211b9384a1d80893916e84fb11d57aad01b202691d4cf6"
  //   );
  //   console.log(result.effects?.status.status);
  // };

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={styles.compose}
    >
      <div className="flex flex-col">
        <div className="flex mb-2">
          <p className="text-black text-lg flex-shrink-0">zkLogin Address:</p>
          {zkLoginSetup.userAddr && (
            <b className="ml-2">
              <a
                className="text-blue-400 underline"
                href={`https://suiscan.xyz/${NETWORK}/account/${zkLoginSetup.userAddr}/tx-blocks`}
              >
                {shortenAddress(zkLoginSetup.userAddr)}
              </a>
            </b>
          )}
        </div>
        <div className="flex mb-4">
          <p className="text-black text-lg flex-shrink-0">Current Status:</p>
          <b className="ml-2 text-black text-lg">{status()}</b>
        </div>
        <p className="mt-2">
          <a
            className="text-blue-400 underline"
            href={`https://suiscan.xyz/${NETWORK}/tx/${digest}`}
          >
            {digest}
          </a>
        </p>
      </div>
      <div>
        <div className="text-red-700 text-lg flex-shrink-0">
          <b>{err}</b>
        </div>
      </div>
      <div
        className="flex flex-col justify-center items-center mb-5"
        style={styles.contentBottom}
      >
        <button
          onClick={async () => {
            setLoading(true);
            const account = zkLoginSetup.account();
            console.log("account", account);
            console.log(zkLoginSetup.userAddr);
            const txb = new TransactionBlock();
            const result = await moveCallSponsoredMint(txb, account);
            console.log(result.effects?.status.status);
            if (result.effects?.status.status === "success") {
              setDigest(result.digest);
              const matchingObject: any = result.objectChanges?.find(
                (obj: any) => obj?.objectType === driveObjectType
              );
              console.log({ matchingObject });
              if (!matchingObject || !matchingObject.objectType) {
                setErr("Double Mint rejected...");
                throw new Error("objectType not found");
              }
              router.push(`/`);
            } else {
              // setErr(`Transaction Failed: ${result.effects?.status.error}`);
              setErr("Transaction Failed...");
            }
            setLoading(false);
          }}
          className={`text-white w-32 py-3 px-5 rounded-xl text-xl ${
            style.myRobotoFont
          } ${
            !zkLoginSetup.zkProofs
              ? "bg-slate-800"
              : "bg-blue-600 hover:bg-slate-700"
          }`}
          disabled={!zkLoginSetup.zkProofs || loading}
        >
          {loading || zkLoginSetup.isProofsLoading ? "Loading..." : "Mint"}
        </button>
      </div>
    </div>
  );
}
