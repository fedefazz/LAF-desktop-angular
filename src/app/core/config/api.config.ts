export const API_CONFIG = {
  // Base URL de la API - cambiar según el entorno
  baseUrl: 'http://localhost:15731',
  
  // Endpoints específicos
  endpoints: {
    token: '/Token',
    userInfo: '/api/Account/UserInfo',
    logout: '/api/Account/Logout',
    users: '/api/Users'
  }
};

// Interfaces para la respuesta de autenticación OAuth2
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type: 'password';
}

export interface UserInfoResponse {
  Id: string;
  Email: string;
  HasRegistered: boolean;
  LoginProvider?: string;
}

// Estructura completa del usuario desde /api/Users/{id}
export interface Role {
  Id: number;
  Name: string;
  Action: any[];
}

export interface FullUserResponse {
  Id: string;
  Email: string;
  EmailConfirmed: boolean;
  UserName: string;
  FirstName: string;
  LastName: string;
  Country: string | null;
  State: string | null;
  City: string | null;
  Address: string | null;
  ZipCode: string | null;
  CellPhone: string | null;
  Description: string | null;
  IsEnabled: boolean;
  IsDeleted: boolean;
  CreationDate: string;
  LastModificationDate: string | null;
  ProfileImagePath: string | null;
  Role: Role[];
  UserClaim: any[];
  UserLogin: any[];
}
