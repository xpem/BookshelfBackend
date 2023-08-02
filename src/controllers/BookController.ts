import { Request, Response } from "express";
import { IBook } from "../models/Book";
import { BookService } from "../services/BookService";
import { BookHistoricService } from "../services/BookHistoricService";
import { BookHistoricController } from "./BookHistoricController";

export class BookController {
  // async Inactive(req: Request, res: Response) {
  //   const bookid =
  // }
  async Create(req: Request, res: Response) {
    const book = {
      Cover: req.body.Cover ?? null,
      Title: req.body.Title ?? null,
      SubTitle: req.body.SubTitle ?? null,
      Authors: req.body.Authors ?? null,
      Volume: req.body.Volume ?? null,
      Pages: req.body.Pages ?? null,
      Year: req.body.Year ?? null,
      Status: req.body.Status ?? null,
      Score: req.body.Score ?? null,
      Comment: req.body.Comment ?? null,
      Genre: req.body.Genre ?? null,
      Isbn: req.body.Isbn ?? null,
      GoogleId: req.body.GoogleId ?? null,
      Inactive: req.body.Inactive ?? null,
    } as IBook;

    book.Uid = String(req.uid);

    const bookController = new BookController();

    if (bookController.ValidateBook(book)) {
      const bookService = new BookService();

      const bookResponse = await bookService.readByTitle(book.Title, book.Uid);

      if (!bookResponse) {
        const bookResponse = await bookService.create(book);
        if (bookResponse.Id) {
          //apos criar com sucesso, gera historico

          await new BookHistoricService().create(bookResponse.Id, 1, book.Uid);

          return res.json(bookResponse);
        }
      } else {
        return res.status(409).json("Livro com este título já cadastrado.");
      }
    } else {
      return res
        .status(409)
        .json("Campos Title, Authors e Status são obrigatórios");
    }
  }

  async Update(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(409).json("Defina um id");
    }

    const book = {
      Cover: req.body.Cover ?? null,
      Title: req.body.Title ?? null,
      SubTitle: req.body.SubTitle ?? null,
      Authors: req.body.Authors ?? null,
      Volume: req.body.Volume ?? null,
      Pages: req.body.Pages ?? null,
      Year: req.body.Year ?? null,
      Status: req.body.Status ?? null,
      Score: req.body.Score ?? null,
      Comment: req.body.Comment ?? null,
      Genre: req.body.Genre ?? null,
      Isbn: req.body.Isbn ?? null,
      GoogleId: req.body.GoogleId ?? null,
      Inactive: req.body.Inactive ?? null,
      Id: Number(id),
    } as IBook;

    book.Uid = String(req.uid);

    const bookController = new BookController();

    if (bookController.ValidateBook(book)) {
      const bookService = new BookService();
      const bookOriResponse = await bookService.readByTitle(
        book.Title,
        book.Uid
      );

      if (bookOriResponse && bookOriResponse.Id != book.Id) {
        return res.status(409).json("Livro com este título já cadastrado.");
      } else {
        const bookResponse = await bookService.update(book);

        await new BookHistoricController().BookUpdateHistoric(
          bookOriResponse as IBook,
          bookResponse,
          book.Uid
        );

        return res.json(bookResponse);
      }
    } else {
      return res
        .status(409)
        .json("Campos Title, Authors e Status são obrigatórios");
    }
  }

  async readByUpdatedAt(req: Request, res: Response) {
    if (!req.params.UpdatedAt) {
      throw new Error("Defina o UpdatedAt");
    }

    const updated_at = req.params.UpdatedAt as string;
    const uid = String(req.uid);
    const bookService = new BookService();

    const booksResponse = await bookService.readListByUpdatedAt(
      new Date(updated_at),
      uid
    );

    return res.json(booksResponse);
  }

  ValidateBook(book: IBook) {
    if (!book.Title) {
      return false;
    }
    if (!book.Authors) {
      return false;
    }
    if (!book.Status) {
      return false;
    }
    return true;
  }
}
