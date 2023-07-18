import { IBookHistoricItem } from "../models/BookHistoricItem";
import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2";
import { Conn } from "../keys";
import { IBookHistoric } from "../models/BookHistoric";

export class BookHistoricItemService {
  create(bookHistoricItem: IBookHistoricItem,  bookHistoricId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "insert into book_historic_item(book_field_id,updated_from,updated_to,book_historic_id) values (?,?,?,?)",
        [
          bookHistoricItem.BookField,
          bookHistoricItem.UpdatedFrom,
          bookHistoricItem.UpdatedTo,
          bookHistoricId,
        ],
        (err, res) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}
