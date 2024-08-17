type Secret = {
  BACKEND_URL: string;
  Secret_Key: string;
  ROOM_CODE: string;
};
let cachedConfig: Secret;

let BACKEND_URL: string;
let Secret_Key: string;
let ROOM_CODE: string;

async function loadConfig() {
  if (cachedConfig) {
    return cachedConfig;
  } else {
    // Load variables from .env file for development
    BACKEND_URL = process.env["NEXT_PUBLIC_BACKEND_URL"] || "";
    Secret_Key = process.env["Secret_Key"] || "";
    ROOM_CODE = process.env["NEXT_PUBLIC_ROOM_CODE"] || "";
  }

  if (!BACKEND_URL) {
    console.log("Error getting BACKEND_URL variable");
  }

  if (!Secret_Key) {
    console.log("Error getting Secret_Key variable");
  }

  if (!ROOM_CODE) {
    console.log("Error getting ROOM_CODE variable");
  }

  // Cache the configuration for future use
  cachedConfig = {
    BACKEND_URL,
    Secret_Key,
    ROOM_CODE,
  };

  return cachedConfig;
}

export default loadConfig;
