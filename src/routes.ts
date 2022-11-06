import { Router } from "express";
import { BookController } from "./controllers/BookController";
import { UserController } from "./controllers/UserController";
import { Authenticate } from "./middleware/Authenticate";

const router = Router();

router.post("/user", new UserController().create);
router.post("/user/session", new UserController().GenerateToken);
router.get("/user", Authenticate, new UserController().getAuthenticatedUser);

router.post("/book", Authenticate, new BookController().create);
router.put("/book/:id", Authenticate, new BookController().update);
router.get("/book/byupdatedat/:UpdatedAt", Authenticate, new BookController().readByUpdatedAt);

export { router };
