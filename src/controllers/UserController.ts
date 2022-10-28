import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { hash, compare } from "bcryptjs";

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!email || !validateEmail(email)) {
      throw new Error("Incorret Email");
    }

    const userService = new UserService();
    const userResponse = await userService.getByEmail(email);

    if (userResponse) {
      throw new Error("User already exists");
    }

    const passwordHash = await hash(password as string, 8);

    const user = await userService.create(name, email, passwordHash);

    return res.json(user);
  }
  async getById(req: Request, res: Response) {
    const uid = req.uid;

    const userService = new UserService();
    const user = await userService.getById(uid);

    return res.json(user);
  }
  async AuthenticateUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const userService = new UserService();
    const userResponse = await userService.getByEmail(email);

    if (!userResponse) {
      throw new Error("User/Password incorrect");
    }

    const passwordMatch = await compare(password, userResponse.password as string);
    
    if (!passwordMatch) {
      throw new Error("User/Password incorrect");
    }

  }
}
