import { OpenIdProvider } from "@/types";

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const openIdProviders: OpenIdProvider[] = [
  "Google",
  // "Twitch",
  // "Facebook",
];

export const PACKAGE_ID =
  "0xb8458434949bd826bf4fdb5ab785d4fa89c0d3060e9b0d96ae836d62a091fe50";

export const NFT_INDEX_ID =
  "0x89ba4a352f8aee8c353988258c20130b5ac4513f6c8f8f7df73a1b746af01fda";

export const NFT_TYPE = `${PACKAGE_ID}::issuer::DriveNFTId`;

export const CLOCK_ID = "0x6";

export const driveObjectType = `${PACKAGE_ID}::nft::DriveNFT`;
