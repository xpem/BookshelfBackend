import { IBookHistoric } from "../models/BookHistoric";
import { Conn } from "../keys";
import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2";
import { IBookHistoricItem } from "../models/BookHistoricItem";

export class BookHistoricService {
  create(
    bookId: number,
    bookhistoricTypeId: number,
    uid: string
  ): Promise<IBookHistoric> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "insert into book_historic(book_id,type_id,uid) values (?,?,?)",
        [bookId, bookhistoricTypeId, uid],
        (err, res) => {
          if (err) reject(err);
          else
            this.readById(res.insertId)
              .then((i) => resolve(i!))
              .catch(reject);
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
  readByBookId(bookId: number, uid: number): Promise<IBookHistoric[] | null> {
    return new Promise((resolve, reject) => {
      Conn.query(
        "select h.id as historic_id, h.created_at as hist_created_at, h.book_id, h.type_id, ht.Name as type_name, i.id as item_id, i.updated_from, i.updated_to, i.book_historic_id, i.created_at as item_created_at, f.Name as field_name from book_historic h " +
          "left join book_historic_item i on h.id = i.book_historic_id " +
          "left join book_historic_item_field f on i.book_field_id = f.id " +
          "left join historic_type ht on h.type_id = ht.id " +
          "where h.book_id = '?' and h.uid = '?' order by i.created_at desc",
        [bookId, uid],
        (err, res) => {
          if (err) reject(err);
          else {
            const rows = <RowDataPacket[]>res;
            const objList: IBookHistoric[] = [];
            if (rows) {
              var counter = 0;

              rows.forEach((row) => {
                if (row) {
                  var obj: IBookHistoric;

                  if (
                    counter > 0 &&
                    objList.length > 0 &&
                    row.book_historic_id &&
                    objList[objList.length - 1].Id == row.historic_id
                  ) {
                    if (row.item_id) {
                      objList[objList.length - 1].BookHistoricItems?.push({
                        Id: row.item_id,
                        BookFieldName: row.field_name,
                        UpdatedFrom: row.updated_from,
                        UpdatedTo: row.updated_to,
                        CreatedAt: row.item_created_at,
                      });
                    }
                  } else {
                    obj = {
                      Id: row.historic_id,
                      CreatedAt: row.hist_created_at,
                      TypeId: row.type_id,
                      Type: row.type_name,
                      BookHistoricItems: [],
                    };

                    if (row.item_id)
                      obj.BookHistoricItems?.push({
                        Id: row.item_id,
                        BookFieldName: row.field_name,
                        UpdatedFrom: row.updated_from,
                        UpdatedTo: row.updated_to,
                        CreatedAt: row.item_created_at,
                      });

                    objList.push(obj);
                  }
                }
                counter++;
              });
              resolve(objList);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }
}
