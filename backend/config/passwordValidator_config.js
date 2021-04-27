const passwordValidatorSchema = require("../models/passwordValidator");

module.exports = (req, res, next) => {
  if (!passwordValidatorSchema.validate(req.body.password)) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères, dont au moins un chiffre et une majuscule" });
  } else {
    next();
  }
};