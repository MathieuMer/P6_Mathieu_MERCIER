const passwordValidator = require("password-validator");

// Creation du schema
const schema = new passwordValidator();

/*
Le mot de passe doit avoir entre 6 et 20 caractères dont :
1 Majuscule
1 miniuscule
1 chiffre
*/

schema
    .is().min(6)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(["Passw0rd", "Password123", "Azerty123"]); // Mots de passes interdits (trop facile)

module.exports = schema;