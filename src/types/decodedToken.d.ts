import type { JwtPayload } from "jsonwebtoken";

declare global {
  interface DecodedToken extends JwtPayload {
    _id: string;
  }
}

export {}
