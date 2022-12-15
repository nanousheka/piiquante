//Express modules.
const express = require('express');
const app = express();

//Miscellaneous modules.
const bodyParser = require('body-parser');
const path = require('path');

//Database modules
const mongoose = require('mongoose');
//const Thing = require('./models/thing');

//Database settings.
mongoose.connect('mongodb+srv://ineszocly:9626Zocly@cluster0.000wm9q.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log(`Votre connexion a échoué parce que ${error}`));

//Helps preventing cross-origins errors.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

//Router modules
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;


