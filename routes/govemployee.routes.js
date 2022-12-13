import express from "express";
import GovEmployeeModel from "../models/govemployee.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

const router = express.Router();
const rounds = 10;

//API => GOVEMPLOYEE

//1. Cadastrar Servidor (CREATE)
router.post("/cadastrarServidor", async (request, response) => {
  try {
    const createNewGovEmployee = await GovEmployeeModel.create(request.body);
    return response.status(201).json(createNewGovEmployee);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Criação do Servidor!" });
  }
});

//2. Listar Servidores (LIST ALL)
router.get("/listarServidores", async (request, response) => {
  try {
    const getAllGovEmployees = await GovEmployeeModel.find();
    return response.status(200).json(getAllGovEmployees);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem de Servidores!" });
  }
});

//3. Listar Servidor by ID (LIST)
router.get("/listarServidor/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const getGovEmployee = await GovEmployeeModel.findById(id).populate(
      "courses"
    );
    return response.status(200).json(getGovEmployee);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem do Servidor" });
  }
});

//4. Editar Servidor by ID (UPDATE)

router.put("/editarServidor/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const update = await GovEmployeeModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(update);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Erro 500 - Falha na Atualização do Servidor" });
  }
});

//5. Excluir Servidor by ID (DELETE)

router.delete("/excluirServidor/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteGovEmployee = await GovEmployeeModel.findByIdAndDelete(id);

    return res.status(200).json(deleteGovEmployee);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Erro 500 - Falha na Exclusão do Servidor" });
  }
});

//6. Listar Cursos do Servidor
router.get("/listarCursosServidor/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const getGovEmployee = await GovEmployeeModel.findById(id).populate(
      "courses"
    );
    const courses = getGovEmployee.courses;
    return response.status(200).json(courses);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem do Servidor" });
  }
});

//7. Autenticar Servidor
router.post("/autenticarServidor", async (request, response) => {
  try {
    const { email, senha } = request.body;

    const user = await GovEmployeeModel.findOne({ email: email });

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Servidor Público não está cadastrado!" });
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

//8. Alterar Senha Servidor
router.post("/alterarSenhaServidor", async (request, response) => {
  try {
    const { email, senha, novaSenha } = request.body;
    //console.log(email, senha, novaSenha);

    const user = await GovEmployeeModel.findOne({ email: email });
    //console.log(user);

    if (!user) {
      return response
        .status(400)
        .json({ msg: "O Servidor Público não está cadastrado!" });
    }

    if (user.senha !== senha) {
      return response.status(400).json({ msg: "Senha incorreta!" });
    }

    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(novaSenha, saltString);

    const newUser = await GovEmployeeModel.findByIdAndUpdate(user._id, {
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

export default router;
