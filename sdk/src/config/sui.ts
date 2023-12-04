import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

// gas budget for our transactions, in MIST
export const GAS_BUDGET = 123456789;

export const NETWORK = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
