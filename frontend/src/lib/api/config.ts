const IS_SERVER = typeof window === "undefined";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const INTERNAL_API_URL = process.env.NEXT_PRIVATE_API_URL;

console.log(process.env.NEXT_PRIVATE_API_URL);
console.log(process.env.NEXT_PUBLIC_API_URL);
