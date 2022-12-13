import express from "express";
import bcrypt from "bcrypt";
import AdminModel from "../models/admin.model.js";
import generateToken from "../config/jwt.config.js";

const router = express.Router();
const rounds = 10;

//1. Autenticar Admin
router.post("/autenticarAdmin", async (request, response) => {
  try {
    const { email, senha} = request.body;

    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Administrador não está cadastrado!" });
    }

    if (await bcrypt.compare(senha, user.senha)) {
      //delete user._doc.senha;
      const token = generateToken(user);

      return response.status(200).json({
        user: { ...user._doc },
        token: token,
      });
    } else {
      return response
        .status(401)
        .json({ msg: "A senha e/ou e-mail incorretos!" });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo deu errado no login" });
  }
});

//8. Alterar Senha Admin
router.post("/alterarSenhaAdmin", async (request, response) => {
  try {
    const {email, senha, novaSenha} = request.body;

    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Administrador não está cadastrado!" });
    }

    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(novaSenha, saltString);

    const newUser = await AutenticationModel.create({
      ...request.body,
      senha: hashPassword,
      novaSenha: "",
    });

    delete user._doc.senha;

    return response.status(201).json(user);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Falha no cadastro!" });
  }
});

export default router;
