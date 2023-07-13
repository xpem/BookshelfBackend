import { IBookHistoric } from "../models/BookHistoric";
import { Conn } from "../keys";
import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2";

export class BookHistoricService {
  create(bookHistoric: IBookHistoric): Promise<IBookHistoric> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>("", [], (err, res) => {
        if (err) reject(err);
        else
          this.readById(res.insertId)
            .then((i) => resolve(i!))
            .catch(reject);
      });
    });
  }
  readById(bookHistoricId: number): Promise<IBookHistoric | undefined> {
    return new Promise((resolve, reject) => {
      Conn.query("", [], (err, res) => {
        if (err) reject(err);
        else {
          const row = (<RowDataPacket>res)[0];
          if (row) {
            const i: IBookHistoric = {
              Id: row.id,
              BookId: row.book_id,
              TypeId: row.type_id,
            };
            resolve(i);
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
}
