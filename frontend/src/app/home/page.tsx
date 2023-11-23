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
