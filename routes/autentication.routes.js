import express from "express";
import bcrypt from "bcrypt";
import AutenticationModel from "../models/autentication.model.js";
import generateToken from "../config/jwt.config.js";

const router = express.Router();
const rounds = 10;

router.post("/registrar", async (request, response) => {
  try {
    const { email, senha, novaSenha, confirmaNovaSenha, perfil } = request.body;

    if (!senha) {
      return response.status(400).json({ msg: "A senha não foi informada!" });
    }

    if (novaSenha !== confirmaNovaSenha) {
      return response.status(400).json({
        msg: "'nova senha' e 'Confirmar nova senha' precisam ser iguais",
      });
    }

    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(novaSenha, saltString);

    const user = await AutenticationModel.create({
      ...request.body,
      senha: hashPassword,
      novaSenha: "",
      confirmaNovaSenha: "",
    });

    delete user._doc.senha;

    return response.status(201).json(user);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Falha no cadastro!" });
  }
});

router.post("/logar", async (request, response) => {
  try {
    const { email, senha, perfil } = request.body;

    const user = await AutenticationModel.findOne({ email: email });

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Usuário não está cadastrado!" });
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

export default router;
