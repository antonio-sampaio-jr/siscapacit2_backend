import mongoose from "mongoose";
import CourseModel from "../models/course.model.js";
import GovEmployeeModel from "../models/govemployee.model.js";


async function connect() {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `Connected to the database. DB_NAME: ${dbConnection.connection.name}`
    );
    //CourseModel.deleteMany();
    //return GovEmployeeModel.deleteMany();
  } 
  catch (error) {
    console.log(error);
  }
}

export default connect;