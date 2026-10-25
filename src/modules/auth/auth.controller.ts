import type { Request, Response } from "express";
import type { CookieOptions } from "express";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { google } from "../../utils/google.js";
import { log } from "console";
import * as authService from "./auth.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { redis } from "../../config/redis.js";
import { sendResponse } from "../../utils/ApiResponse.js";
import type { RegisterAdminInput } from "./auth.validation.js";


interface GoogleClaims {
    sub: string;
    email: string;
    name: string;
    email_verified?: boolean;
    picture?: string;
}


export const logOutUser = async (req: Request, res: Response) => {
    // extract tokens from the cookie
    const accessToken = req.cookies?.accessToken;
    if (!accessToken)
        throw new ApiError(401, 'invalid token');

    // block this token
    // await redis.set(`invalidated:user:${req.user.id}:token`, accessToken);
    const redisKey = `blacklisted:token:${accessToken}`
    await redis.set(redisKey, 'true', {
        EX: 60
    });

    // clear the cookie
    const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        path: '/'
    };
    res.clearCookie('accessToken', cookieOptions);

    return sendResponse(
        res,
        200,
        {},
        'user logged out successfully'
    )
}

export const checkMe = async(req: Request, res: Response) => {
    const result = await authService.checkMe(req.user);
    return sendResponse(
        res,
        200,
        result,
        'user authenticated successfully'
    );
}


export const registerAdmin = async(req: Request, res: Response) => {
    const body = req.body as RegisterAdminInput;
    const admin = await authService.registerAdmin(body);
    return sendResponse(
        res,
        201,
        admin,
        'admin resgisterd successfully'
    );
}


export const getGoogleLoginPage = async (req: Request, res: Response) => {
    // if user is already logged , then redirect it to homepage
    // if(req.user)
    //     return res.redirect("/");

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
        'openid',
        'profile',
        'email'
    ]);

    const cookieConfig: CookieOptions = {
        httpOnly: true,
        secure: false, // mark in true in production
        maxAge: 10 * 60 * 1000, // for 10 mins 
        sameSite: "lax",
        path: '/'
    };

    res.cookie("google_oauth_state", state, cookieConfig);
    res.cookie("google_code_verifier", codeVerifier, cookieConfig);

    return res.redirect(url.toString());
}


export const getGoogleLoginCallback = async (req: Request, res: Response) => {
    // google redirects with code, and state in query params, we can use this to find the user

    const { code, state, error } = req.query;
    log(code, state);

    const {
        google_oauth_state: storedState,
        google_code_verifier: storedCodeVerifier
    } = req.cookies;


    const clearOAuthCookies = () => {
        res.clearCookie("google_oauth_state", { path: '/' });
        res.clearCookie("google_code_verifier", { path: '/' });
    }

    if (error) {
        clearOAuthCookies();
        return res.redirect('/auth/login');
    }


    if (
        typeof code !== "string" ||
        typeof state !== "string" ||
        typeof storedState !== "string" ||
        typeof storedCodeVerifier !== "string" ||
        state !== storedState
    ) {
        clearOAuthCookies();
        return res.redirect("/auth/login");
    }


    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    if (!tokens) {
        clearOAuthCookies();
        return res.redirect("/auth/login");
    }

    console.log(tokens);

    const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
    const { sub: googleUserId, name, email } = claims;
    if (
        !googleUserId ||
        !email
        // email_verified !== true
    ) {
        clearOAuthCookies();
        return res.redirect("/auth/login"); // give urls of frontend page , maybe again the login page as we get some error
    }

    try {
        // check whether this googleId is for some user
        let user = await authService.getUserByGoogleId(googleUserId);

        // if not, then check whether this email is already linked with user or not
        if (!user)
            user = await authService.getUserByEmail(email);

        if (user) {
            if (user.googleId && user.googleId !== googleUserId) {
                clearOAuthCookies();
                return res.redirect('/auth/login');
            }

            // user already exists with this email but the google oauth isn't linked
            if (!user.googleId) {
                await authService.linkUserWithOauth({
                    userId: user.id,
                    googleId: googleUserId
                });
            }
        }
        else { // create a new user as both the google id and email isnot used
            user = await authService.createUserWithOauth({
                email,
                googleId: googleUserId
            });
        }


        // generate access tokens for them
        const result = await authService.authenticateUser({ id: user.id, email: user.email, role: user.role });
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
            path: '/'
        })

        // return res.redirect(process.env.FRONTEND_URL ?? "http://localhost:5173");
        return sendResponse(
            res, 
            200,
            user,
            'googleOauthSuccessful'
        )
    } catch (error) {
        clearOAuthCookies();
        throw error;
    }
};