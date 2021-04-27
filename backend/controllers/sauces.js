const Sauce = require('../models/sauce_model');
const fs = require('fs'); // package File System pour accéder aux fichiers

// Gestion ajouter nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id; // Supprime le champs id du corps de la requête
	const sauce = new Sauce({
		...sauceObject, // Opérateur spread pour affecter les données directement au modèle
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
	});
	sauce.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
		.catch(error => res.status(400).json({ error }));
};

// Gestion modifier sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ?
		{
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(201).json({ message: 'Sauce modifiée' }))
		.catch(error => res.status(400).json({ error }));
};

// Gestion suppression sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split('/image/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(201).json({ message: 'Sauce supprimée' }))
					.catch(error => res.status(400).json({ error }));
			});
		})
		.catch(error => res.status(500).json({ error }));
};

// Gestion trouver toutes les sauces
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then(sauces => res.status(200).json(sauces))
		.catch(error => res.status(400).jsons({ error }));
};

// Gestion trouver une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

// Gestion like / dislike
exports.likeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			switch (req.body.like) {
				case -1: // Cas dislike
					sauce.dislikes = sauce.dislikes + 1;
					sauce.usersDisliked.push(req.body.userId);
					sauceObject = {
						"dislikes": sauce.dislikes,
						"usersDisliked": sauce.usersDisliked
					}
					break;
				case +1: // Cas like
					sauce.likes = sauce.likes + 1;
					sauce.usersLiked.push(req.body.userId);
					sauceObject = {
						"likes": sauce.likes,
						"usersLiked": sauce.usersLiked
					}
					break;
				case 0: // pas de like, pas de de dislike => Vérification 
					if (sauce.usersDisliked.find(user => user === req.body.userId)) {
						sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
						sauce.dislikes = sauce.dislikes - 1;
						sauceObject = {
							"dislikes": sauce.dislikes,
							"usersDisliked": sauce.usersDisliked
						}
					} else {
						sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
						sauce.likes = sauce.likes - 1;
						sauceObject = {
							"likes": sauce.likes,
							"usersLiked": sauce.usersLiked
						}
					}
					break;
				default:
					return res.status(500).json({ error });
			}
			Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Sauce liké !' }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(() => res.status(400).json({ error: 'Sauce non trouvée !' }));
}