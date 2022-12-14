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
      console.log("==>" + getServidor);
      if (!getServidor.courses.includes(idCurso)) {
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
            $push: { courses: idCurso },
          },
          { new: true, runValidators: true }
        );
        return response.status(200).json({ msg: "Ok" });
      } else
        return response
          .status(500)
          .json({ msg: "Erro 500 - Servidor já matriculado!" });
    } catch (error) {
      console.log(error);

      return response
        .status(500)
        .json({ msg: "Erro 500 - Falha na Atualização do Curso" });
    }
  }
);

//7. Desfazer a Matrícula de Curso (idCurso) por Servidor (idServidor)
router.put(
  "/desmatricularCurso/:idCurso/:idServidor",
  async (request, response) => {
    try {
      const { idCurso } = request.params;
      const { idServidor } = request.params;

      const getServidor = await GovEmployeeModel.findById(idServidor);
      console.log("==>" + getServidor);
      if (getServidor.courses.includes(idCurso)) {
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
            $pull: { courses: idCurso },
          },
          { new: true, runValidators: true }
        );
        return response.status(200).json({ msg: "Ok" });
      } else
        return response
          .status(500)
          .json({ msg: "Erro 500 - Servidor não matriculado neste curso" });
    } catch (error) {
      console.log(error);

      return response
        .status(500)
        .json({ msg: "Erro 500 - Falha na Atualização do Curso" });
    }
  }
);

/*
router.put('/matricularCurso/:idCurso/:idServidor', async (request, response) => {
    try {
        const { idCurso } = request.params;
        const { idServidor } = request.params;

        request.body.govemployees.forEach(async element => {
            // atualizar a coleção govemployee com o idCurso
            await GovEmployeeModel.findByIdAndUpdate(
                element.govemployee,
                {
                    $push: {courses: idCurso}
                },
                {new: true, runValidators: true}    
            );
        });

        request.body.courses.array.forEach(async element => {
            // atualizar cada produto inserido no pedido
            await CourseModel.findByIdAndUpdate(
                element.courses,
                {
                    $push: {govemployees: idServidor}
                },
                {new: true, runValidators: true}    
            );
        });

        return response.status(200).json({ msg: "Curso e Servidor atualizados!"});

    } catch (error) {
        console.log(error)

        return response.status(500).json({ msg: "Erro 500 - Falha na Atualização do Curso"});
    }
})

//7. Desfazer a Matrícula de Curso (idCurso) por Servidor (idServidor) 

router.delete('/matricularCurso/:idCurso/:idServidor', async (req, res) => {
    try {
        const { idCurso } = req.params;
        const { idServidor } = req.params;

        request.body.govemployees.forEach(async element => {
            // atualizar cada produto inserido no pedido
            await GovEmployeeModel.findByIdAndDelete(
                element.govemployee,
                {
                    $pull: {courses: idCurso}
                },
                {new: true, runValidators: true}    
            );
        });

        request.body.courses.forEach(async element => {
            // atualizar cada produto inserido no pedido
            await CourseModel.findByIdAndDelete(
                element.courses,
                {
                    $pull: {govemployees: idServidor}
                },
                {new: true, runValidators: true}    
            );
        });

        return res.status(200).json({ msg: "Curso e Servidor atualizados!"});

    } catch (error) {
        console.log(error)

        return res.status(500).json({ msg: "Erro 500 - Falha na Atualização do Curso"});
    }
})
// AddProductsToOrder
/* router.post("/create",async(request,response)=>{
    try{
        const AddProductToOrder = await ProductModel.create(
            {products:request.body.products}
        );
        AddProductToOrder.products.array.forEach(async element => {
            // atualizar cada produto inserido no pedido
            await ProductModel.findByIdAndUpdate(
                element.product,
                {
                    $push: {orders: AddProductToOrder._id}
                },
                {new: true, runValidators: true}    
            );
        });
        return response.status(201).json(AddProductToOrder);
    } catch (error) {
        console.log(error);
        return response.status(500).json({msg: "Algo está errado!"});
    }
});
 */
export default router;
