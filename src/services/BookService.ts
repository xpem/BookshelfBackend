import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2";
import { Conn } from "../keys";
import { IBook } from "../models/Book";

export class BookService {
  create(book: IBook): Promise<IBook> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "insert into books( uid, title, subtitle, authors, volume, pages, year, status, genre, isbn, cover, google_id, score, comment, updated_at)" +
          " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,now())",
        [
          book.Uid,
          book.Title,
          book.SubTitle,
          book.Authors,
          book.Volume,
          book.Pages,
          book.Year,
          book.Status,
          book.Genre,
          book.Isbn,
          book.Cover,
          book.GoogleId,
          book.Score,
          book.Comment,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.readById(res.insertId)
              .then((book) => resolve(book!))
              .catch(reject);
        }
      );
    });
  }
  update(book: IBook): Promise<IBook> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "update books set title = ?, subtitle = ?, authors = ?, volume = ?, pages = ?, year = ?, status = ?, genre = ?, isbn = ?, cover = ?, google_id = ?, score = ?, comment = ?, updated_at = now(), inactive = ? where id = ? and uid = ?",
        [
          book.Title,
          book.SubTitle,
          book.Authors,
          book.Volume,
          book.Pages,
          book.Year,
          book.Status,
          book.Genre,
          book.Isbn,
          book.Cover,
          book.GoogleId,
          book.Score,
          book.Comment,
          book.Inactive,
          book.Id,
          book.Uid,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.readById(book.Id!)
              .then((book) => resolve(book!))
              .catch(reject);
        }
      );
    });
  }
  Inactive(bookid: number, uid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "update books set updated_at = now(), inactive = 1 where id = ? and uid = ?",
        [bookid, uid],
        (err, res) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  readByTitle(title: String, uid: string): Promise<IBook | null> {
    return new Promise((resolve, reject) => {
      Conn.query(
        "SELECT id, uid, title, subtitle, authors, volume, pages, year, status," +
          " genre, isbn, cover, google_id, score, comment, created_at, updated_at," +
          " inactive FROM books WHERE title = ? and uid = ?",
        [title, uid],
        (err, res) => {
          if (err) reject(err);
          else {
            const row = (<RowDataPacket>res)[0];
            if (row) {
              const book: IBook = {
                Id: row.id,
                Uid: row.uid,
                Title: row.title,
                SubTitle: row.subtitle,
                Authors: row.authors,
                Volume: row.volume,
                Pages: row.pages,
                Year: row.year,
                Status: row.status,
                Genre: row.genre,
                Isbn: row.isbn,
                Cover: row.cover,
                GoogleId: row.google_id,
                Score: row.score,
                Comment: row.comment,
                CreatedAt: row.created_at,
                UpdatedAt: row.updated_at,
                Inactive: row.inactive,
              };
              resolve(book);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }
  readListByUpdatedAt(updatedAt: Date, uid: string): Promise<IBook[] | null> {
    return new Promise((resolve, reject) => {
      Conn.query(
        "SELECT id, uid, title, subtitle, authors, volume, pages, year, status," +
          " genre, isbn, cover, google_id, score, comment, created_at, updated_at," +
          " inactive FROM books WHERE updated_at > ? and uid = ?",
        [updatedAt, uid],
        (err, res) => {
          if (err) reject(err);
          else {
            const rows = <RowDataPacket[]>res;
            const books: IBook[] = [];
            if (rows) {
              rows.forEach((row) => {
                if (row) {
                  const book: IBook = {
                    Id: row.id,
                    // Uid: row.uid,
                    Title: row.title,
                    SubTitle: row.subtitle,
                    Authors: row.authors,
                    Volume: row.volume,
                    Pages: row.pages,
                    Year: row.year,
                    Status: row.status,
                    Genre: row.genre,
                    Isbn: row.isbn,
                    Cover: row.cover,
                    GoogleId: row.google_id,
                    Score: row.score,
                    Comment: row.comment,
                    CreatedAt: row.created_at,
                    UpdatedAt: row.updated_at,
                    Inactive: row.inactive,
                  };

                  books.push(book);
                }
              });
              resolve(books);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }
  readById(bookId: number): Promise<IBook | undefined> {
    return new Promise((resolve, reject) => {
      Conn.query(
        "SELECT id, uid, title, subtitle, authors, volume, pages, year, status," +
          " genre, isbn, cover, google_id, score, comment, created_at, updated_at," +
          " inactive FROM books WHERE id = ?",
        [bookId],
        (err, res) => {
          if (err) reject(err);
          else {
            const row = (<RowDataPacket>res)[0];
            if (row) {
              const book: IBook = {
                Id: row.id,
                //Uid: row.uid,
                Title: row.title,
                SubTitle: row.subtitle,
                Authors: row.authors,
                Volume: row.volume,
                Pages: row.pages,
                Year: row.year,
                Status: row.status,
                Genre: row.genre,
                Isbn: row.isbn,
                Cover: row.cover,
                GoogleId: row.google_id,
                Score: row.score,
                Comment: row.comment,
                CreatedAt: row.created_at,
                UpdatedAt: row.updated_at,
                Inactive: row.inactive,
              };
              resolve(book);
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }
}
