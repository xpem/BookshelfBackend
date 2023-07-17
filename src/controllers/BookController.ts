import { Request, Response } from "express";
import { IBook } from "../models/Book";
import { BookService } from "../services/BookService";
import { IBookHistoric } from "../models/BookHistoric";
import { BookHistoricService } from "../services/BookHistoricService";

export class BookController {
  async create(req: Request, res: Response) {
    console.log(req.body);
    const {
      Cover,
      Title,
      SubTitle,
      Authors,
      Volume,
      Pages,
      Year,
      Status,
      Score,
      Comment,
      Genre,
      Isbn,
      GoogleId,
      Inactive,
    } = req.body;

    const book = {
      Cover: Cover ?? null,
      Title: Title ?? null,
      SubTitle: SubTitle ?? null,
      Authors: Authors ?? null,
      Volume: Volume ?? null,
      Pages: Pages ?? null,
      Year: Year ?? null,
      Status: Status ?? null,
      Score: Score ?? null,
      Comment: Comment ?? null,
      Genre: Genre ?? null,
      Isbn: Isbn ?? null,
      GoogleId: GoogleId ?? null,
      Inactive: Inactive ?? null,
    } as IBook;

    book.Uid = String(req.uid);

    console.log(book);

    const bookController = new BookController();

    if (bookController.ValidateBook(book)) {
      const bookService = new BookService();

      const bookResponse = await bookService.readByTitle(book.Title, book.Uid);

      if (!bookResponse) {
        const bookResponse = await bookService.create(book);
        if (bookResponse.Id) {
          //apos criar com sucesso, gera historico

          await new BookHistoricService().create(bookResponse.Id);

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

  async update(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(409).json("Defina um id");
    }

    const {
      Cover,
      Title,
      SubTitle,
      Authors,
      Volume,
      Pages,
      Year,
      Status,
      Score,
      Comment,
      Genre,
      Isbn,
      GoogleId,
      Inactive,
    } = req.body;

    const book = {
      Cover: Cover ?? null,
      Title: Title ?? null,
      SubTitle: SubTitle ?? null,
      Authors: Authors ?? null,
      Volume: Volume ?? null,
      Pages: Pages ?? null,
      Year: Year ?? null,
      Status: Status ?? null,
      Score: Score ?? null,
      Comment: Comment ?? null,
      Genre: Genre ?? null,
      Isbn: Isbn ?? null,
      GoogleId: GoogleId ?? null,
      Inactive: Inactive ?? null,
      Id: Number(id),
    } as IBook;

    book.Uid = String(req.uid);

    console.log(book);

    const bookController = new BookController();

    if (bookController.ValidateBook(book)) {
      const bookService = new BookService();

      const bookResponse = await bookService.readByTitle(book.Title, book.Uid);

      if (bookResponse && bookResponse.Id != book.Id) {
        return res.status(409).json("Livro com este título já cadastrado.");
      } else {
        const bookResponse = await bookService.update(book);
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
