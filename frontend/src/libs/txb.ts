import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { PACKAGE_ID, NFT_INDEX_ID, CLOCK_ID } from "@/config";

export function callMint(txb: TransactionBlock, args: any) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      // txb.pure(NFT_INDEX_ID),
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

export function callLike(txb: TransactionBlock, args: any) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [txb.pure(args.id)],
  });
}

export const moveCallLike = (
  txb: TransactionBlock,
  props: {
    id: string;
  }
) => {
  callMint(txb, {
    id: props.id,
  });
};
