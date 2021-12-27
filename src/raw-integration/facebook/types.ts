/* eslint-disable camelcase */
export interface FacebookUser {
  id: string;
  first_name: string;
  last_name: string;
  name_format: string;
  short_name: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export interface FacebookAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}
