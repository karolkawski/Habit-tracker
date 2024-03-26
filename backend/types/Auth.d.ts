import { Request } from "express";
export type AuthenticatedRequest = Request & {
  user?: {
    tokens: string[];
    save: () => Promise<void>;
  };
};

export type AuthenticatedRequestWithTimeQuery = Request<{}, {}, { time?: string }> & {
  user?: { _id: string };
};
