
export interface OIDCConfig {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  claims_supported: string[];
}

export interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: any;
}

export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: string;
}

export type ViewType = 'discovery' | 'builder' | 'debugger' | 'assistant';

export interface AuthRequestParams {
  issuer: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  state: string;
  nonce: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}
