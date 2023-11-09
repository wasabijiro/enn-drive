import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";

export const PACKAGE_ID =
  "0xdbda1f10ee21cea9f017a6c103b144166138966e5c09a3d9f43e4d9f03b16c2e";

export const EVENT_CONFIG_ID =
  "0x1a98d7905b3ab0d9ef374f548dd7ab947b304dd5f9083ff9eb8adf0d698f0688";

export const CLOCK_ID = "0x6";

export const EVENT_KEY = "movejp10";

export interface MintArgs {
  // list: string | TransactionArgument;
  event_key: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: MintArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(EVENT_CONFIG_ID),
      txb.pure(CLOCK_ID),
      txb.pure(EVENT_KEY),
      txb.pure(args.name),
      txb.pure(args.description),
      txb.pure(args.url),
    ],
  });
}

export const moveCallMintNft = (
  txb: TransactionBlock,
  props: {
    event_key: string;
    name: string;
    description: string;
    url: string;
  }
) => {
  firstMint(txb, {
    event_key: props.event_key,
    name: props.name,
    description: props.description,
    url: props.url,
  });
};
