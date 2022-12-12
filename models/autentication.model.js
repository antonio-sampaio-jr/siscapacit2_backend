import { model, Schema } from "mongoose";

const autenticationSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  senha: {
    type: String,
    required: true,
  },
  //teste
  perfil: {
    type: String,
    enum: ["usuário", "admin"],
    default: "usuário",
  },
});
const AutenticationModel = model("Autentication", autenticationSchema);

export default AutenticationModel;
