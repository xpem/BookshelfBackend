import { IBookHistoricItem } from "./BookHistoricItem";

export interface IBookHistoric {
  Id?: number | null;
  BookId: number;
  TypeId?: number | null;
  Type?: string | null;
  CreatedAt?: Date;

  BookHistoricItems?: IBookHistoricItem[];
}
