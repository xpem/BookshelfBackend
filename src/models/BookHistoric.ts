import { IBookHistoricItem } from "./BookHistoricItem";

export interface IBookHistoric {
  Id?: number | null;
  BookId?: number | null;
  TypeId?: number | null;
  Type?: string | null;
  CreatedAt?: Date;

  BookHistoricItems?: IBookHistoricItem[];
}
