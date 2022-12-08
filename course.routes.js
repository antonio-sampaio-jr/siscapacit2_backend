import express, { request } from "express";
import CourseModel from "../models/course.model.js";
import GovEmployeeModel from "../models/govemployee.model.js";

const router = express.Router();

//API => COURSES

//1. Cadastrar Curso (CREATE)
router.post("/cadastrarCurso", async (request, response) => {
  try {
    const createNewCourse = await CourseModel.create(request.body);
    return response.status(201).json(createNewCourse);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Criação do Curso!" });
  }
});

//2. Listar Cursos (LIST ALL)
router.get("/listarCursos", async (request, response) => {
  try {
    const getAllCourses = await CourseModel.find();
    return response.status(200).json(getAllCourses);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem de Servidores!" });
  }
});

//3. Listar Curso by ID (LIST)
router.get("/listarCurso/:id", async (request, response) => {
  try {
    const { id } = request.params;
    //Problema o populate
    const getCourse = await CourseModel.findById(id).populate("govemployees");
    //2 populates
    return response.status(200).json(getCourse);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro 500 - Falha na Listagem do Curso" });
  }
});

//4. Editar Curso by ID (UPDATE)

router.put("/editarCurso/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const update = await CourseModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(update);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Erro 500 - Falha na Atualização do Curso" });
  }
});

//5. Excluir Curso by ID (DELETE)

router.delete("/excluirCurso/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCourse = await CourseModel.findByIdAndDelete(id);

    return res.status(200).json(deleteCourse);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Erro 500 - Falha na Exclusão do Curso" });
  }
});

//6. Fazer Matrícula de Curso (idCurso) por Servidor (idServidor)
router.put(
  "/matricularCurso/:idCurso/:idServidor",
  async (request, response) => {
    try {
      const { idCurso } = request.params;
      const { idServidor } = request.params;

      const getServidor = await GovEmployeeModel.findById(idServidor);
      const getCurso = await CourseModel.findById(idCurso);

      if (
        !getServidor.inscricoesAbertas.includes(idCurso) &&
        getCurso.situacao === "Inscrições Abertas"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $push: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $push: { inscricoesAbertas: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      }
      if (
        !getServidor.emAndamento.includes(idCurso) &&
        getCurso.situacao === "Em Andamento"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $push: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $push: { emAndamento: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      }
      if (
        !getServidor.concluido.includes(idCurso) &&
        getCurso.situacao === "Concluído"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $push: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $push: { concluido: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      } else {
        return response
          .status(500)
          .json({ msg: "Erro 500 - Servidor já matriculado!" });
      }
    } catch (error) {
      console.log(error);

      return response
        .status(500)
        .json({ msg: "Erro 500 - Falha na Atualização do Curso/Servidor" });
    }
  }
);

//6. Desfazer a Matrícula de Curso (idCurso) por Servidor (idServidor)
router.put(
  "/desmatricularCurso/:idCurso/:idServidor",
  async (request, response) => {
    try {
      const { idCurso } = request.params;
      const { idServidor } = request.params;

      const getServidor = await GovEmployeeModel.findById(idServidor);
      const getCurso = await CourseModel.findById(idCurso);

      if (
        getServidor.inscricoesAbertas.includes(idCurso) &&
        getCurso.situacao === "Inscrições Abertas"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $pull: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $pull: { inscricoesAbertas: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      }
      if (
        getServidor.emAndamento.includes(idCurso) &&
        getCurso.situacao === "Em Andamento"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $pull: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $pull: { emAndamento: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      }
      if (
        getServidor.concluido.includes(idCurso) &&
        getCurso.situacao === "Concluído"
      ) {
        const updateCourse = await CourseModel.findByIdAndUpdate(
          idCurso,
          {
            $pull: { govemployees: idServidor },
          },
          { new: true, runValidators: true }
        );

        const updateGovEmployee = await GovEmployeeModel.findByIdAndUpdate(
          idServidor,
          {
            $pull: { concluido: idCurso },
          },
          { new: true, runValidators: true }
        );

        return response.status(200).json({ msg: "Ok" });
      } else {
        return response
          .status(500)
          .json({ msg: "Erro 500 - Servidor não matriculado neste curso!" });
      }
    } catch (error) {
      console.log(error);

      return response
        .status(500)
        .json({ msg: "Erro 500 - Falha na Atualização do Curso/Servidor" });
    }
  }
);

export default router;
