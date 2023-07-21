import { Router } from "express";
import { BookController } from "./controllers/BookController";
import { UserController } from "./controllers/UserController";
import { Authenticate } from "./middleware/Authenticate";
import path from "path";
import { BookHistoricController } from "./controllers/BookHistoricController";

const router = Router();

router.post("/book", Authenticate, new BookController().Create);
router.get("/book/historic/:id", Authenticate, new BookHistoricController().ReadByBookId);
router.put("/book/:id", Authenticate, new BookController().Update);
router.get(
  "/book/byupdatedat/:UpdatedAt",
  Authenticate,
  new BookController().readByUpdatedAt
);

router.post("/user", new UserController().create);
router.post("/user/session", new UserController().GenerateToken);
router.get("/user", Authenticate, new UserController().getAuthenticatedUser);
router.post(
  "/user/recoverpassword",
  new UserController().sendEmailRecoverPassword
);

router.get("/user/changepassword/:token", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post(
  "/user/changepassword/:token",
  urlencodedParser,
  new UserController().ChangePassword
);

export { router };
