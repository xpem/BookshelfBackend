import { IBookHistoric } from "../models/BookHistoric";
import { Conn } from "../keys";
import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2";

export class BookHistoricService {
  create(bookId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "insert into book_historic(created_at,book_id,type_id) values (now(),?,1)",
        [bookId],
        (err, res) => {
          if (err) reject(err);
          else resolve();
          // this.readById(res.insertId)
          //   .then((i) => resolve(i!))
          //   .catch(reject);
        }
      );
    });
  }
  readById(bookHistoricId: number): Promise<IBookHistoric | undefined> {
    return new Promise((resolve, reject) => {
      Conn.query(
        "select id,created_at,book_id,type_id from book_historic where id = ?",
        [bookHistoricId],
        (err, res) => {
          if (err) reject(err);
          else {
            const row = (<RowDataPacket>res)[0];
            if (row) {
              const i: IBookHistoric = {
                Id: row.id,
                BookId: row.book_id,
                TypeId: row.type_id,
                CreatedAt: row.creation_dt,
              };
              resolve(i);
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }
}
