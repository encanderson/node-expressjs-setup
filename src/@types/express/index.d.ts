declare namespace Express {
  export interface Request {
    user: {
      userId?: string;
      active?: boolean;
      app?: string;
      name?: string;
      email?: string;
      profession?: string;
      refreshToken?: string;
      token?: string;
    };
    access: {
      permissions: Permission;
    };
  }
}
