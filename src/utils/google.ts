import "dotenv/config"
import { Google } from "arctic";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if(!clientId || !clientSecret || !callbackURL)
    throw new Error("Missing Google OAuth environment variables");

export const google = new Google(
    clientId,
    clientSecret,
    callbackURL
);


