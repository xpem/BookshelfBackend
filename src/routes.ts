import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { ITeste } from "./models/Teste";
import { TesteRepository } from "./services/TesteService";

const router = Router();



//testes
router.get("/", async (req, res) => {
  return res.status(200).json({
    message: "I'm awake 2!",
  });
});

router.get("/teste", async (req, res) => {
  const testerepo = new TesteRepository();

  const resp = await testerepo.readAll();
  console.log(resp);
  return res.status(200).json(resp);
});

router.post("/teste", async (req, res) => {
  const text = req.body.text as string;

  const testerepo = new TesteRepository();

  const resp = await testerepo.create({ texto: text });
  console.log(resp);
  return res.status(200).json(resp);
});
//

router.post("/user", new UserController().create);



export { router };
