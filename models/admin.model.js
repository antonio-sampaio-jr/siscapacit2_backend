import { model, Schema } from "mongoose";

const adminSchema = new Schema({
  nome:{
    type: String,
    required: true,
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
  }
});
const AdminModel = model("Admin", adminSchema);

export default AdminModel;
