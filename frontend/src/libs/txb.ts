import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";

export const PACKAGE_ID =
  "0x9de53f0f8671835352cbaf51a3b7beafeb39e074474e0755ffd67bc17af49341";

export const NFT_INDEX_ID =
  "0x114526d99f997bf70c53928425cbc1cd406cf6e2fc24ced19a47a29c5ececce9";

export const CLOCK_ID = "0x6";

export const EVENT_KEY = "movejp10";

// export interface MintArgs {
//   // list: string | TransactionArgument;
//   event_key: string | TransactionArgument;
//   name: string | TransactionArgument;
//   description: string | TransactionArgument;
//   url: string | TransactionArgument;
// }

export function callMint(txb: TransactionBlock, args: any) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(NFT_INDEX_ID),
      txb.pure(CLOCK_ID),
      txb.pure(args.name),
      txb.pure(args.description),
      txb.pure(args.url),
    ],
  });
}

export const moveCallMintNft = (
  txb: TransactionBlock,
  props: {
    name: string;
    description: string;
    url: string;
  }
) => {
  callMint(txb, {
    name: props.name,
    description: props.description,
    url: props.url,
  });
};
