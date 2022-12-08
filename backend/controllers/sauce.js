const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const reqSauce = JSON.parse(req.body.sauce);
  delete reqSauce._id;
  delete reqSauce._userId;
  const newSauce = new Sauce({
      ...reqSauce,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
}

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((dbSauce) => {
    if (dbSauce.userId != req.auth.userId) {
      res.status(401).json({ message : 'Vous n\'êtes pas autorisé à acceder à cette page'});
    }
    else {
      const reqSauce = JSON.parse(...req.body.sauce);
      const reqImage= req.body.image;
      const updatedSauce = {};

      if(reqImage){
        delete dbSauce.imageUrl;
        const dbImageFilename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${dbImageFilename}`);
        updatedSauce = {...reqSauce,imageUrl: `${req.protocol}://${req.get('host')}/images/${req.body.file.filename}`};
      }else{updatedSauce = {...reqSauce}}
    }
    //delete sauceObject._userId;
    Sauce.updateOne({ _id: req.params.id},{ updatedSauce/*, _id: req.params.id*/})
      .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
      .catch(error => res.status(500).json({ message: 'Nous rencontrons un problème', data: error }));

  })
  .catch((error) => {
    res.status(400).json({ Message: 'Nous rencontrons un problème', data: error });
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.findAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({error});
    }
  );
};

exports.findOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
}

exports.likeSauce = (req, res, next) =>{
  const userId = req.auth.userId;
  const like = JSON.parse(req.body.like);
  Sauce.findOne({_id: req.params.id})
  .then((sauce) =>{
    if(like == 1){
      sauce.usersLiked.push(userId);
      sauce.likes = sauce.likes + like;
    }
    if(like == -1){
      sauce.usersDisliked.find(user => user = userId);
      sauce.likes = sauce.likes + like;
    }
    if(like == 0){

    }

  })
  .catch(error => {
    const message = 'Nous n\'avons pas trouvé la sauce demandée';
    res.status(404).json({message: message, data: error});
  } );
}
