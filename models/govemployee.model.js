import {model,Schema} from "mongoose";

const govemployeeSchema = new Schema(
    {
        matricula: {
            type: String,
            required:true
        },
        nome: {
            type: String,
            required:true
        },
        foto: {
            type: String,
            required:true
        },
        orgao: {
            type: String,
            required:true
        },
        vinculo: {
            type: String,
            enum:["Estatutário","Comissionado","Terceirizado","Estagiário"]
        },
        cargo: {
            type: String,
            required:true
        },
        lotacao: {
            type: String,
            required:true
        },
        exercicio: {
            type: String,
            required:true
        },
        email: {
            type:String,
            unique:true,
            match:/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
            lowercase:true
        },
        telefone: {
            type: String,
            required:true
        },
        celular: {
            type: String,
            required:true
        },
        dataAdmissao: {
            type: Date,
            default:Date.now
        },
        cpf: {
            type: String,
            required:true
        },
        dataNascimento: {
            type: Date,
            required:true
        },
        naturalidade: {
            type: String,
            required:true
        },
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    },
    {
        timestamps: true,
    } 
);

const GovEmployeeModel = model("GovEmployee",govemployeeSchema);

export default GovEmployeeModel;
