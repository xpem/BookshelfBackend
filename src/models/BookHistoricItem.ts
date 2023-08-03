import { IBookHistoric } from "./BookHistoric";

export interface IBookHistoricItem {
  Id?: number | null;
  BookFieldId: number;
  UpdatedFrom: string;
  UpdatedTo: string;

  CreatedAt?: Date | null;
  BookFieldName?: string | null;
}
