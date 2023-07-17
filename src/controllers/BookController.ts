import { Request, Response } from "express";
import { IBook } from "../models/Book";
import { BookService } from "../services/BookService";
import { BookHistoricService } from "../services/BookHistoricService";
import { IBookHistoricItem } from "../models/BookHistoricItem";

export class BookController {
  async create(req: Request, res: Response) {
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

          await new BookHistoricService().create(bookResponse.Id, 1);

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
  async BuildBookHistoric(oriBook: IBook, book: IBook) {
    const bookHistoric = await new BookHistoricService().create(
      book.Id as number,
      2
    );

    if (bookHistoric) {
      // if(bookOri.Cover && book.Cover)
      if (oriBook.Title && book.Title) {
        var bookHistoricItem = {
          BookField: 2,
          UpdatedFrom: oriBook.Title,
          UpdatedTo: book.Title,
          BookHistoric: bookHistoric,
        } as IBookHistoricItem;
      }
      if (oriBook.SubTitle && book.SubTitle) {
        var bookHistoricItem = {
          BookField: 1,
          UpdatedFrom: oriBook.SubTitle,
          UpdatedTo: book.SubTitle,
          BookHistoric: bookHistoric,
        } as IBookHistoricItem;
      }
      if (oriBook.Cover && book.Cover) {
        var bookHistoricItem = {
          BookField: 3,
          UpdatedFrom: oriBook.Cover,
          UpdatedTo: book.Cover,
          BookHistoric: bookHistoric,
        } as IBookHistoricItem;
      }
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
