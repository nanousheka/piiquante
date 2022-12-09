const Sauce = require('../models/Sauce');
const fs = require('fs');
const { ifError } = require('assert');
const { findOne } = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const reqSauce = JSON.parse(req.body.sauce);
  delete reqSauce._id;
  delete reqSauce._userId;
  const sauce = new Sauce({
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
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Vous n\'avez pas les autorisations nécessaire pour accéder à cette page'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, userId: req.auth.userId})
              .then(() => res.status(200).json({message : 'Sauce modifiée avec succès!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
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
  Sauce.findOne({_id: req.params.id})
  .then((sauce) =>{
    const parsedLike = parseInt(req.body.like);
    if (!sauce.userId === req.auth.user){
      if(parsedLike === 1){
        if(!sauce.usersLiked.find(user => user = req.auth.userId)){
          Sauce.updateOne({_id: req.params.id},{$inc: { likes: 1 }, $push:{usersLiked : req.auth.userId}})
          .then(() => res.status(200).json({message : 'Liké avec succès!'}))
          .catch(error => res.status(401).json({ error }));
        }
      }

      if(parsedLike === 0){
        if(sauce.usersLiked.find(user => user = req.auth.userId)){
          Sauce.updateOne({_id: req.params.id},{$inc: { likes: -1 }, $pull:{usersLiked : req.auth.userId}})
          .then(() => res.status(200).json({message : 'Retrait du like avec succès!'}))
          .catch(error => res.status(401).json({ error }));
        }
        if(sauce.usersDisliked.find(user => user = req.auth.userId)){
          Sauce.updateOne({_id: req.params.id},{$inc: { dislikes: -1 }, $pull:{usersLiked : req.auth.userId}})
          .then(() => res.status(200).json({message : 'Retrait du dislike avec succès!'}))
          .catch(error => res.status(401).json({ error }));
        }
      }

      if(parsedLike === -1){
        if(!sauce.usersDisliked.find(user => user = req.auth.userId)){
          Sauce.updateOne({_id: req.params.id},{$inc: { dislikes: 1 }, $push:{usersDisliked : req.auth.userId}})
          .then(() => res.status(200).json({message : 'Disliké avec succès!'}))
          .catch(error => res.status(401).json({ error }));
        }
      }
    }else{
      res.json({message: 'Vous n\'êtes pas autorisé(e) à liker ou disliker votre propre sauce.'})
    }

  })
  .catch(error => {
    const message = 'Nous n\'avons pas trouvé la sauce demandée';
    res.status(404).json({message: message, data: error});
  });
}
