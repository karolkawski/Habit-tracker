import { Request } from "express";
export type AuthenticatedRequest = Request & {
  user?: {
    tokens: string[];
    save: () => Promise<void>;
  };
};
