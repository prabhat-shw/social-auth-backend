/* eslint-disable camelcase */
import { URLSearchParams } from 'url';
import axios, { AxiosResponse } from 'axios';
import { FacebookUser, FacebookAccessToken } from './types';
import {
  FACEBOOK_OAUTH_BASE_URL,
  FACEBOOK_CONSENT_SCREEN_URL,
  PROFILE_FIELDS,
  SCOPES,
} from '@src/configs/facebook';

const {
  SERVER_ROOT_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URI,
  NODE_ENV,
} = process.env;

export function getFacebookAuthURL(): string {
  const params: URLSearchParams = new URLSearchParams({
    redirect_uri: `${SERVER_ROOT_URL}/${FACEBOOK_REDIRECT_URI}`,
    client_id: FACEBOOK_CLIENT_ID as string,
    state: NODE_ENV as string,
    scope: SCOPES,
  });
  return `${FACEBOOK_CONSENT_SCREEN_URL}?${params.toString()}`;
}

export async function getTokens(code: string): Promise<FacebookAccessToken> {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = `${FACEBOOK_OAUTH_BASE_URL}/oauth/access_token`;
  const params: URLSearchParams = new URLSearchParams({
    code,
    client_id: FACEBOOK_CLIENT_ID as string,
    client_secret: FACEBOOK_CLIENT_SECRET as string,
    redirect_uri: `${SERVER_ROOT_URL}/${FACEBOOK_REDIRECT_URI}`,
  });
  try {
    const response: AxiosResponse = await axios.get(`${url}?${params.toString()}`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to fetch auth tokens`);
    throw error;
  }
}

export async function getUser(accessToken: string): Promise<FacebookUser> {
  try {
    const rootUrl = `${FACEBOOK_OAUTH_BASE_URL}/me`;
    const params: URLSearchParams = new URLSearchParams({
      access_token: accessToken,
      fields: PROFILE_FIELDS.join(','),
    });
    const response: AxiosResponse = await axios.get(`${rootUrl}?${params.toString()}`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to fetch user`);
    throw error;
  }
}
