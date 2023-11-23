import { OpenIdProvider } from "@/types";

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const openIdProviders: OpenIdProvider[] = [
  "Google",
  // "Twitch",
  // "Facebook",
];

export const PACKAGE_ID =
  "0x64229f62ff4bd0491a71868534786e2b87dbfea34105e5db6d42a64e7e4eb608";

export const NFT_INDEX_ID =
  "0x89ba4a352f8aee8c353988258c20130b5ac4513f6c8f8f7df73a1b746af01fda";

export const NFT_TYPE = `${PACKAGE_ID}::issuer::DriveNFTId`;

export const CLOCK_ID = "0x6";

export const driveObjectType = `${PACKAGE_ID}::nft::DriveNFT`;
