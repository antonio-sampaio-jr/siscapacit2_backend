export async function isAdmin(req, res, next) {
    try {
      if (req.currentUser.role !== "ADMIN") {
        return res.status(401).json({ msg: "Administrador Não Autorizado." });
      }
  
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
}