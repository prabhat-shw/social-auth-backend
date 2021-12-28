/* eslint-disable camelcase */
import { URLSearchParams } from 'url';
import axios, { AxiosResponse } from 'axios';
import {
  GITHUB_CONSENT_SCREEN_URL,
  SCOPES,
  GITHUB_ACCESS_TOKEN_URL,
  GET_USER_URL,
} from '@src/configs/github';
import { GitHubUser, GithubAccessToken } from './types';

const { SERVER_ROOT_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI, NODE_ENV } =
  process.env;

export function getGithubAuthURL(): string {
  const params: URLSearchParams = new URLSearchParams({
    redirect_uri: `${SERVER_ROOT_URL}/${GITHUB_REDIRECT_URI}`,
    client_id: GITHUB_CLIENT_ID as string,
    allow_signup: 'false',
    state: NODE_ENV as string,
    scope: SCOPES.join(' '),
  });
  return `${GITHUB_CONSENT_SCREEN_URL}?${params.toString()}`;
}

export async function getTokens(code: string): Promise<GithubAccessToken> {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const params: URLSearchParams = new URLSearchParams({
    code,
    client_id: GITHUB_CLIENT_ID as string,
    client_secret: GITHUB_CLIENT_SECRET as string,
    redirect_uri: `${SERVER_ROOT_URL}/${GITHUB_REDIRECT_URI}`,
  });
  try {
    const response: AxiosResponse = await axios.post(GITHUB_ACCESS_TOKEN_URL, params.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to fetch auth tokens`);
    throw new Error(error.message);
  }
}

export async function getUser(accessToken: string): Promise<GitHubUser> {
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
