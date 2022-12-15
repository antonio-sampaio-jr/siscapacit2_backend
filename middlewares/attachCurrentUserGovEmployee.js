import GovEmployeeModel from "../models/govemployee.model.js";

async function attachCurrentUserAdmin(request, response, next) {
  try {
    const loggedUser = request.auth;

    const user = await GovEmployeeModel.findOne({ _id: loggedUser._id });

    if (!user) {
      return response.status(400).json({ msg: "Este Servidor Público não existe" });
    }

    request.currentUser = user;

    next();
  } catch (error) {
    console.log(error);
    return response.status(500).json("algo deu errado:", error);
  }
}

export default attachCurrentUserGovEmployee;