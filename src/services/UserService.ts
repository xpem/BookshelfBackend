import { RowDataPacket, OkPacket } from "mysql2";
import { conn } from "../DatabaseConn";
import { IUser } from "../models/User";

// export const conn = mysql.createConnection({
//     host: DatabaseKeys.host,
//     user: DatabaseKeys.user,
//     database: DatabaseKeys.database,
//     password: DatabaseKeys.password,
//   });

export class UserService {
  create(name: string, email: string, passwordHash: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      conn.query<OkPacket>(
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
      conn.query("SELECT * FROM users WHERE id = ?", [uid], (err, res) => {
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
      conn.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
        if (err) reject(err);
        else {
          const row = (<RowDataPacket>res)[0];
          if (row) {
            const user: IUser = {
              id: row.id,
              email: row.email,
              name: row.name,
            };
            resolve(user);
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
}
