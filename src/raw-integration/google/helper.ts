/* eslint-disable camelcase */
import { URLSearchParams } from 'url';
import axios, { AxiosResponse } from 'axios';
import {
  GOOGLE_CONSENT_SCREEN_URL,
  SCOPES,
  GET_ACCESS_TOKEN_URL,
  GET_USER_URL,
} from '@src/configs/google';
import { GoogleUser, GoogleAccessToken } from './types';

const { SERVER_ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

export function getGoogleAuthURL(): string {
  const params: URLSearchParams = new URLSearchParams({
    redirect_uri: `${SERVER_ROOT_URL}/${GOOGLE_REDIRECT_URI}`,
    client_id: GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: SCOPES.join(' '),
  });
  return `${GOOGLE_CONSENT_SCREEN_URL}?${params.toString()}`;
}

export async function getTokens(code: string): Promise<GoogleAccessToken> {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const params: URLSearchParams = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID as string,
    client_secret: GOOGLE_CLIENT_SECRET as string,
    redirect_uri: `${SERVER_ROOT_URL}/${GOOGLE_REDIRECT_URI}`,
    grant_type: 'authorization_code',
  });
  try {
    const response: AxiosResponse = await axios.post(GET_ACCESS_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to fetch auth tokens`);
    throw new Error(error.message);
  }
}

export async function getUser(accessToken: string): Promise<GoogleUser> {
  try {
    const response: AxiosResponse = await axios.get(GET_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to fetch user`);
    throw new Error(error.message);
  }
}
