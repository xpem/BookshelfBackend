import { RowDataPacket, OkPacket } from "mysql2";
import { Conn } from "../keys";
import { IUser } from "../models/User";

export class UserService {
  create(name: string, email: string, passwordHash: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "INSERT INTO users(name,email,password,updated_at) VALUES(?,?,?, NOW())",
        [name, email, passwordHash],
        (err, res) => {
          if (err) reject(err);
          else
            this.getById(res.insertId)
              .then((user) => resolve(user!))
              .catch(reject);
        }
      );
    });
  }
  getById(uid: number): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      Conn.query("SELECT * FROM users WHERE id = ?", [uid], (err, res) => {
        if (err) reject(err);
        else {
          const row = (<RowDataPacket>res)[0];
          if (row) {
            const user: IUser = {
              id: row.id,
              name: row.name,
              email: row.email,
            };
            resolve(user);
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
  getByEmail(email: string): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      Conn.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
        if (err) reject(err);
        else {
          const row = (<RowDataPacket>res)[0];
          if (row) {
            const user: IUser = {
              id: row.id,
              email: row.email,
              name: row.name,
              password: row.password,
            };
            resolve(user);
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
  updatePassword(uid: number, passwordHash: string): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      Conn.query<OkPacket>(
        "update users set password = ? where id = ?",
        [passwordHash, uid],
        (err, res) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
}
