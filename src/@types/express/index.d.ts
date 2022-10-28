//necessário defini-lo no typeRoots no tsconfig
declare namespace Express {
    export interface Request {
      uid: number;
    }
  }
  