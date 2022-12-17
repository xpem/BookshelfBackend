import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { hash, compare } from "bcryptjs";
import { sign, TokenExpiredError, verify } from "jsonwebtoken";
import { EmailKeys, JwtSecret } from "../keys";

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

  async getAuthenticatedUser(req: Request, res: Response) {
    const uid = req.uid;

    const userService = new UserService();
    const user = await userService.getById(uid);

    return res.json(user);
  }

  async ChangePassword(req: Request, res: Response) {
    const { password, cpassword } = req.body;
    const tempToken = req.params.token;
    try {
      const { sub } = verify(tempToken, JwtSecret);

      if (password === cpassword) {
        const passwordHash = await hash(password as string, 8);
        const userService = new UserService();
        await userService.updatePassword(Number(sub), passwordHash);
      } else throw new Error("Invalid password Confirmation");
    } catch (err) {
      try {
        const { message } = err as TokenExpiredError;
        return res.send(message);
      } catch {
        throw err;
      }
    }
    return res.send("Senha Alterada!");
  }

  async GenerateToken(req: Request, res: Response) {
    const { email, password } = req.body;

    const userService = new UserService();
    const userResponse = await userService.getByEmail(email);

    console.log(userResponse);

    if (!userResponse) {
      throw new Error("User/Password incorrect");
    }

    const passwordMatch = await compare(
      password,
      String(userResponse.password)
    );

    if (!passwordMatch) {
      throw new Error("User/Password incorrect");
    }

    const token = sign(
      { name: userResponse.name, email: userResponse.email },
      JwtSecret,
      { subject: String(userResponse.id), expiresIn: "30d" }
    );

    return res.json({ token: token });
  }
  async sendEmailRecoverPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      throw new Error("Incorret Email");
    }

    const userService = new UserService();
    const userResponse = await userService.getByEmail(email);

    if (!userResponse) {
      throw new Error("Email not found");
    }

    const token = sign({}, JwtSecret, {
      subject: String(userResponse.id),
      expiresIn: "1h",
    });

    const mailer = require("nodemailer");

    const smtpTransport = mailer.createTransport({
      host: EmailKeys.host,
      port: 587,
      auth: {
        user: EmailKeys.user,
        pass: EmailKeys.pass,
      },
    });

    //smtpTransport.verify().then(console.log).catch(console.error);

    //urls atuais
    const url = process.env.PORT_BOOKSHELFSERVER_SERVER
      ? "http://xpbookshelf.kinghost.net:21208"
      : "http://localhost:3001";

    const mail = {
      from: "XPEM User Configs <XpemBot@gmail.com>",
      to: email,
      subject: `XPEM alteração de senha`,
      html: `<h2><a href='${url}/user/changepassword/${token}'>Acesse este link para alterar sua senha</a></h2>`,
      //html: "<b>Opcionalmente, pode enviar como HTML</b>"
    };

    smtpTransport
      .sendMail(mail)
      .then((response: any) => {
        smtpTransport.close();
        // console.log(response);
        return res.json({ Mensagem: "Email enviado!" });
      })
      .catch((error: Error) => {
        smtpTransport.close();
        console.log(error);
        throw new Error("Erro ao enviar o email");
      });
  }
}
