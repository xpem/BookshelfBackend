export interface IBook {
    Id?: number | null;
    Uid?: string | null,
    Title: string,
    SubTitle: string,
    Authors: string,
    Volume:number,
    Pages:number,
    Year:number,
    Status:number,
    Genre: string,
    Isbn: string,
    Cover: string,
    GoogleId: string,
    Score:number,
    Comment: string,
    CreatedAt?:Date,
    UpdatedAt:Date,
    Inactive:number
  }