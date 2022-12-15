import express from "express";
import bcrypt from "bcrypt";
import AdminModel from "../models/admin.model.js";
import generateToken from "../config/jwt.config.js";

const router = express.Router();
const rounds = 10;

//1. Autenticar Admin
router.post("/autenticarAdmin", async (request, response) => {
  try {
    const { email, senha } = request.body;

    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Administrador não está cadastrado!" });
    }
    //console.log(senha, user.senha);
    //console.log(user);
    if (senha === user.senha) {
      //delete user._doc.senha;
      const token = generateToken(user);

      return response.status(200).json({
        user: { ...user._doc },
        token: token,
      });
      //return response.status(200).json({ msg: "OkAdmin" });
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

//2. Alterar Senha Admin
router.post("/alterarSenhaAdmin", async (request, response) => {
  try {
    const { email, senha, novaSenha } = request.body;
    //console.log(email, senha, novaSenha);

    const user = await AdminModel.findOne({ email: email });
    //console.log(user);

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Administrador não está cadastrado!" });
    }

    if (user.senha !== senha) {
      return response.status(400).json({ msg: "Senha incorreta!" });
    }

    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(novaSenha, saltString);

    const newUser = await AdminModel.findByIdAndUpdate(user._id, {
      ...request.body,
      senha: hashPassword,
    });

    delete user._doc.senha;

    return response.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Falha no cadastro!" });
  }
});

//3. Listar Servidor by ID (LIST)
router.get("/listarAdministrador/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const getAdmin = await AdminModel.findById(id);
    return response.status(200).json(getAdmin);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem do Servidor" });
  }
});

export default router;
