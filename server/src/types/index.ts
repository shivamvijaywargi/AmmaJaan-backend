export interface IDecodedJwtPayload {
  user_id: string;
  role: number;
}

export type IRoles = (number | undefined)[];
