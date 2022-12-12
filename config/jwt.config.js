import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const { _id, nome, email, perfil } = user;
  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, nome, email, perfil }, signature, {
    expiresIn: expiration,
  });
};

export default generateToken;