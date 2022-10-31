import { Request, Response } from "express";
import { IBook } from "../models/Book";
import { BookService } from "../services/BookService";

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

      const bookResponse = await bookService.readByTitle(Title as string);

      if (!bookResponse) {
        const bookResponse = await bookService.create(book);
        return res.json(bookResponse);
      } else {
        return res.status(409).json("Livro com este título já cadastrado.");
      }
    } else {
      return res
        .status(409)
        .json("Campos Title, Authors e Status são obrigatórios");
    }
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
