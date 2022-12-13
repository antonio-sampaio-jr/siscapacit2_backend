import { model, Schema } from "mongoose";

const autenticationSchema = new Schema({
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
  novaSenha: {
    type: String,
  },
  confirmaNovaSenha: {
    type: String,
  },
  perfil: {
    type: String,
    enum: ["1", "2"], //1 é admin, 2 é usuário
    default: "usuário",
  },
});
const AutenticationModel = model("Autentication", autenticationSchema);

export default AutenticationModel;
