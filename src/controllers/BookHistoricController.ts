import { IBook } from "../models/Book";
import { IBookHistoricItem } from "../models/BookHistoricItem";
import { BookHistoricService } from "../services/BookHistoricService";
import { BookHistoricItemService } from "../services/BookHsitoricItemService";
import { Request, Response } from "express";

export class BookHistoricController {
  async BookUpdateHistoric(oriBook: IBook, book: IBook, uid: string) {
    var bookHistoricItemList = [] as IBookHistoricItem[];

    // if(bookOri.Cover && book.Cover)
    if (oriBook.Title !== book.Title)
      bookHistoricItemList.push({
        BookFieldId: 2,
        UpdatedFrom: oriBook.Title,
        UpdatedTo: book.Title,
      } as IBookHistoricItem);

    if (oriBook.SubTitle !== book.SubTitle)
      bookHistoricItemList.push({
        BookFieldId: 1,
        UpdatedFrom: oriBook.SubTitle,
        UpdatedTo: book.SubTitle,
      } as IBookHistoricItem);

    // if (oriBook.Cover !== book.Cover)
    //   bookHistoricItemList.push({
    //     BookField: 3,
    //     UpdatedFrom: oriBook.Cover,
    //     UpdatedTo: book.Cover,
    //   } as IBookHistoricItem);

    if (oriBook.Authors !== book.Authors)
      bookHistoricItemList.push({
        BookFieldId: 4,
        UpdatedFrom: oriBook.Authors,
        UpdatedTo: book.Authors,
      } as IBookHistoricItem);

    if (oriBook.Volume !== book.Volume)
      bookHistoricItemList.push({
        BookFieldId: 5,
        UpdatedFrom: oriBook.Volume.toString(),
        UpdatedTo: book.Volume.toString(),
      } as IBookHistoricItem);

    if (oriBook.Pages !== book.Pages)
      bookHistoricItemList.push({
        BookFieldId: 6,
        UpdatedFrom: oriBook.Pages.toString(),
        UpdatedTo: book.Pages.toString(),
      } as IBookHistoricItem);

    if (oriBook.Year !== book.Year)
      bookHistoricItemList.push({
        BookFieldId: 7,
        UpdatedFrom: oriBook.Year.toString(),
        UpdatedTo: book.Year.toString(),
      } as IBookHistoricItem);

    if (oriBook.Status !== book.Status)
      bookHistoricItemList.push({
        BookFieldId: 8,
        UpdatedFrom: oriBook.Status.toString(),
        UpdatedTo: book.Status.toString(),
      } as IBookHistoricItem);

    if (oriBook.Score !== book.Score)
      bookHistoricItemList.push({
        BookFieldId: 9,
        UpdatedFrom: oriBook.Score.toString(),
        UpdatedTo: book.Score.toString(),
      } as IBookHistoricItem);

    if (oriBook.Genre !== book.Genre)
      bookHistoricItemList.push({
        BookFieldId: 10,
        UpdatedFrom: oriBook.Genre.toString(),
        UpdatedTo: book.Genre.toString(),
      } as IBookHistoricItem);

    if (oriBook.Isbn !== book.Isbn)
      bookHistoricItemList.push({
        BookFieldId: 11,
        UpdatedFrom: oriBook.Isbn.toString(),
        UpdatedTo: book.Isbn.toString(),
      } as IBookHistoricItem);

    if (bookHistoricItemList.length > 0) {
      const bookHistoric = await new BookHistoricService().create(
        book.Id as number,
        2,
        uid as string
      );

      bookHistoricItemList.forEach(
        async (x) =>
          await new BookHistoricItemService().create(
            x,
            bookHistoric.Id as number
          )
      );
    }
  }
  async ReadByCreatedAt(req: Request, res: Response) {
    if (!req.params.CreatedAt) throw new Error("Defina a data mínima");

    const created_at = req.params.CreatedAt as string;
    var uid = Number(req.uid);

    const bookHistoric = await new BookHistoricService().readHistoric(
      0,
      uid,
      new Date(created_at),
      false,
      true
    );
    return res.json(bookHistoric);
  }
  async ReadByBookId(req: Request, res: Response) {
    if (!req.params.id) throw new Error("Defina o id");

    const Id = req.params.id as string;
    var uid = Number(req.uid);

    const bookHistoric = await new BookHistoricService().readHistoric(
      Number(Id),
      uid,
      new Date(),
      true,
      false
    );
    return res.json(bookHistoric);
  }
}
