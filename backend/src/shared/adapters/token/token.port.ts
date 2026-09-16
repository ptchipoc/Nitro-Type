export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export abstract class TokenPort {
  abstract generatePair(payload: {
    sub: string;
    email: string;
    role: string;
  }): TokenPair;
  abstract verifyAccess(token: string): {
    sub: string;
    email: string;
    role: string;
  };
  abstract verifyRefresh(token: string): {
    sub: string;
    email: string;
    role: string;
  };
}
