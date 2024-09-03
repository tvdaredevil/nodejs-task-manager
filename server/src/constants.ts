import path from "path";

export const STATIC_DIR = path.resolve(__dirname, "../../client/dist");

export const NODE_ENV =
  process.env.NODE_ENV == "production" ? "production" : "development";

export const AUTH_DISABLED =
  process.env.AUTH_DISABLED === "true" || NODE_ENV === "development";
