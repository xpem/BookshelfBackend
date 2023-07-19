import { IBookHistoricItem } from "./BookHistoricItem";

export interface IBookHistoric {
  Id?: number | null;
  BookId: number;
  TypeId: number;
  CreatedAt?: Date;

  BookHistoricItems?: IBookHistoricItem[];
}
