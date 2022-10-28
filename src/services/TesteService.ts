import mysql, { OkPacket } from "mysql2";
import { ITeste } from "../models/Teste";
import { RowDataPacket } from "mysql2";
import { conn } from "../DatabaseConn";


export class TesteRepository {
  readAll(): Promise<ITeste[]> {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * FROM teste", (err: any, res: any) => {
        if (err) reject(err);
        else {
          const rows = <RowDataPacket[]>res;
          const testes: ITeste[] = [];
          rows.forEach((row) => {
            const teste: ITeste = {
              id: row.id,
              texto: row.texto,
            };
            testes.push(teste);
          });

          resolve(testes);
        }
      });
    });
  }
  readById(teste_id: number): Promise<ITeste | undefined> {
    return new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM teste WHERE id = ?",
        [teste_id],
        (err, res) => {
          if (err) reject(err);
          else {
            const row = (<RowDataPacket> res)[0];
            const teste: ITeste =  {
                id: row.id,
                texto: row.texto,
              
            }
            resolve(teste);
          }
        }
      );
    });
  }
  create(teste: ITeste): Promise<ITeste> {
    return new Promise((resolve, reject) => {
      conn.query<OkPacket>(
        "INSERT INTO teste (texto) VALUES(?)",
        [teste.texto],
        (err, res) => {
          if (err) reject(err);
          else
            this.readById(res.insertId)
              .then((teste) => resolve(teste!))
              .catch(reject);
        }
      );
    });
  }
}
