//Express modules.
const express = require('express');
const app = express();

//Miscellaneous modules.
const bodyParser = require('body-parser');
const path = require('path');


//Database modules
const mongoose = require('mongoose');

//Security modules
const helmet = require('helmet');


//Database settings.
mongoose.connect(process.env.MDB_CREDENTIALS , { useNewUrlParser: true,
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

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

//Router modules
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;


