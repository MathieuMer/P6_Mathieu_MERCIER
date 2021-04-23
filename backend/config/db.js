const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@sopekocko.abapc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée :', err));