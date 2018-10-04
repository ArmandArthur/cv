var serviceConstante = require(__dirname + "/get-constante.js");
var rp = require('request-promise');


var Framework = sequelizeFramework(serviceConstante);
var Experience = sequelizeExperience(serviceConstante);
var Categorie = sequelizeCategorie(serviceConstante);
var ExperienceFramework = sequelizeExperienceFramework(serviceConstante);
var Utilisateur = sequelizeUtilisateur(serviceConstante);


Framework.associate = function () {
	Framework.belongsToMany(Experience, {
		as: 'experiences',
		through: 'experienceframework',
		foreignKey: 'frameworkId'
	});
	Framework.belongsTo(Categorie, {
		foreignKey: 'categorie_id'
	})
};
Experience.associate = function () {
	Experience.belongsToMany(Framework, {
		as: 'frameworks',
		through: 'experienceframework',
		foreignKey: 'experienceId'
	});
};

exports.associateGlobale = function () {
	Framework.associate();
	Experience.associate();
}
exports.associateGlobale();
ExperienceFramework.sync();
Categorie.sync();
Framework.sync();


Experience.sync();
Utilisateur.sync();

exports.getCategories = function (req, res) {

	Categorie.findAll().then(categories => {


		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(categories);
		//res.end();
	})


};
exports.getFrameworks = function (req, res) {

	Framework.findAll({
		include: [{
			model: Categorie,
			as: 'categorie'
		}]
	}).then(frameworks => {


		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(frameworks);
		//res.end();
	})


};
exports.getExperiences = function (req, res) {

	Experience.findAll({
		include: [{
			model: Framework,
			as: 'frameworks'
		}]
	}).then(experiences => {


		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(experiences);
		//res.end();
	})


};

exports.getFrameworksByCategorieValue = function (req, res) {


	Framework.findAll({
			include: [{
				model: Categorie,
				where: {
					value: req.params.categorie_label
				}
			}]
		})
		.then(frameworks => {
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.send(frameworks);
		})


};

exports.getUtilisateurByIp = function (req, res) {


	Utilisateur.findOne({
			where : {
				ip : req.params.ip
			}
		})
		.then(utilisateur => {
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.send(utilisateur);
		})


};

exports.categorie = function (req, res) {

	const categorie = Categorie.build({
		label: req.body.categorie_nom,
		value: req.body.categorie_nom
	});
	categorie.save().then(() => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(categorie);
	})


};

exports.utilisateur = function (req, res) {

	const utilisateur = Utilisateur.build({
		email: req.body.email,
		ip: req.body.ip
	});
	utilisateur.save().then(() => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(utilisateur);
	})


};

exports.framework = function (req, res) {

	const framework = {
		id: req.body.framework_id,
		nom: req.body.framework_nom,
		version: req.body.framework_version,
		level: req.body.framework_level,
		categorie_id: req.body.categorie_id
	};
	if (req.body.framework_id != null) {
		Framework.update(framework, {
			where: {
				id: framework.id
			}
		}).then(() => {

			Framework.findOne({
				where: {
					'id': req.body.framework_id
				},
				include: [{
					model: Categorie
				}]
			}).then(frameworkCategorie => {
				res.send(frameworkCategorie);
			})
		})
	} else {

		Framework.create(framework).then((frameworkItem) => {
			Framework.findOne({
				where: {
					'id': frameworkItem.get('id')
				},
				include: [{
					model: Categorie
				}]
			}).then(frameworkCategorie => {
				res.send(frameworkCategorie);
			})
		})
	}


};


exports.experience = function (req, res) {


	//jointure_experience_framework(Experience,Framework,ExperienceFramework);
	const experience = {
		titre: req.body.experience_titre,
		id: req.body.experience_id,
		date_debut: req.body.date_debut,
		date_fin: req.body.date_fin,
		type: req.body.type,
		description: req.body.description
	};


	if (experience.id == null) 
	{

			Experience.create(experience).then((experienceInsert)=>{
					experienceInsert.addFramework(req.body.frameworks_checked);

					// le timeout permet aux insert de s'effectuer, avec des promises, ça serait plus propre
					// 200 c'est rapide néanmoins
					setTimeout(function(){ Experience.findOne({
						where: {
							'id': experienceInsert.get('id')
						},
						include: [{
							model: Framework,
							as: 'frameworks'
						}]
					}).then(experienceFinale => {
						res.send(experienceFinale)
					}) }, 200);
			});
	}
	else
	{
		Experience.update(experience, {
			where: {
				id: experience.id
			}
		}).then((d) => {
			Experience.findOne({
				where: {
					'id': experience.id
				}
				,
				include: [{
							model: Framework,
							as: 'frameworks'
						}]
			}).then(experienceUpdate => {
				experienceUpdate.getFrameworks().then((frameworks) => {
					experienceUpdate.removeFramework(frameworks);
					experienceUpdate.addFramework(req.body.frameworks_checked);

					setTimeout(function(){ Experience.findOne({
						where: {
							'id': experienceUpdate.get('id')
						},
						include: [{
							model: Framework,
							as: 'frameworks'
						}]
					}).then(experienceFinale => {
						res.send(experienceFinale)
					}) }, 200);

				});
			});

		});
	}


};

function sequelizeCategorie(serviceConstante) {
	return serviceConstante.sequelize.define('categorie', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},		
		label: {
			type: serviceConstante.Sequelize.STRING
		},
		value: {
			type: serviceConstante.Sequelize.STRING
		}
	});
}

function sequelizeFramework(serviceConstante) {
	return serviceConstante.sequelize.define('framework', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nom: {
			type: serviceConstante.Sequelize.STRING
		},
		version: {
			type: serviceConstante.Sequelize.STRING
		},
		level: {
			type: serviceConstante.Sequelize.STRING
		},
		categorie_id: {
			type: serviceConstante.Sequelize.INTEGER
		}
	} );
}

function sequelizeExperience(serviceConstante) {
	return serviceConstante.sequelize.define('experience', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		titre: {
			type: serviceConstante.Sequelize.STRING
		}
		,
		date_debut: {
			type: serviceConstante.Sequelize.DATE
		}
		,
		date_fin: {
			type: serviceConstante.Sequelize.DATE
		}
		,
		type: {
			type: serviceConstante.Sequelize.INTEGER
		}
		,
		description: {
			type: serviceConstante.Sequelize.TEXT
		}
	});


}

function sequelizeExperienceFramework(serviceConstante) {
	return serviceConstante.sequelize.define('experienceframework', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		experienceId: {
			type: serviceConstante.Sequelize.INTEGER
		},
		frameworkId: {
			type: serviceConstante.Sequelize.INTEGER
		}
	}, {
		tableName: 'experienceframework'
	});
}

function sequelizeUtilisateur(serviceConstante) {
	return serviceConstante.sequelize.define('utilisateur', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: serviceConstante.Sequelize.STRING
		},
		ip: {
			type: serviceConstante.Sequelize.STRING
		}
	});


}