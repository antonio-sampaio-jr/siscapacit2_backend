import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    idCurso: {
      type: String,
      required: true,
    },
    formaRealizacao: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
      required: true,
    },
    local: {
      type: String,
      required: true,
    },
    ofertante: {
      type: String,
      required: true,
    },
    periodoInscricao: {
      type: String,
      required: true,
    },
    vagas: {
      type: Number, //no SISCAPACIT 1.0 está como "text"
      required: true,
    },
    periodoRealizacao: {
      type: String,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["Aperfeiçoamento", "Especialização", "Mestrado", "Doutorado"],
    },
    site: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
      maxlength: 500, //confirmar se vamos colocar mesmo um limite, e se sim, qual o tamanho
    },
    criteriosSelecao: {
      type: String,
      required: true,
      maxlength: 150, //confirmar se vamos colocar mesmo um limite, e se sim, qual o tamanho
    },
    situacao: {
      type: String,
      enum: ["Inscrições Abertas", "Em Andamento", "Concluído"],
    },

    govemployees: [
      {
            type: Schema.Types.ObjectId,
            ref: "GovEmployee",
      }  
    ]
  },
  {
    timestamps: true,
  }
);

const CourseModel = model("Course",courseSchema);

export default CourseModel;