import { IBookHistoric } from "./BookHistoric";

export interface IBookHistoricItem {
  Id?: number | null;
  BookField: number;
  UpdatedFrom: string;
  UpdatedTo: string;

  CreatedAt?: Date | null;
  BookFieldName?: string | null;
}
