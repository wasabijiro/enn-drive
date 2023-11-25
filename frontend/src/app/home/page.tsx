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

    <div className="flex justify-center items-center h-screen bg-gray-100 px-3">
      <div className="p-6 max-w-sm w-90 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold">このアプリの使い方</h1>
        <ol className="my-2">
          <li className="text-lg font-bold">運転開始の設定:</li>
          <li style={{ textIndent: "10px" }}>アプリを開いたら、運転開始ボタンを押して<span className="text-lime-600 font-bold">運転モード</span>に入ります。</li>
          <li style={{ textIndent: "10px" }}><span className="text-lime-600 font-bold">運転開始ボタン</span>を押さないと<span className="text-rose-400 font-bold">「いいね」</span>のフェッチが行われません。 </li>
          <li className="text-lg font-bold"><span className="text-rose-400 font-bold">「いいね」</span>の送信: </li>
          <li style={{ textIndent: "10px" }}>運転中に良い行動を目撃した際に、ワンタップで周囲の車にまとめて<span className="text-rose-400 font-bold">「いいね」</span>を送ります。 </li>
          <li style={{ textIndent: "10px" }}><span className="text-rose-400 font-bold">「いいね」</span>は特定の車へ送るのではなく、周囲の車全体に対して行います。 </li>
          <li className="text-lg font-bold"><span className="text-rose-400 font-bold">「いいね」</span>の受信と通知: </li>
          <li style={{ textIndent: "10px" }}>自分が<span className="text-rose-400 font-bold">「いいね」</span>を受け取った場合、アプリから通知が届きます。 </li>
        </ol>
        <button
          className={`w-full text-white w-32 py-3 px-5 rounded-xl text-xl ${style.myRobotoFont
            } ${!zkLoginSetup.zkProofs
              ? "bg-slate-800"
              : "bg-blue-600 hover:bg-slate-700"
            }`}
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
          disabled={!zkLoginSetup.zkProofs || loading}
        >
          {loading || zkLoginSetup.isProofsLoading ? (loading ? "ミント中" : "アドレスを生成中") : "Let's Drive!"}
        </button>
      </div>
    </div>
  );
}
