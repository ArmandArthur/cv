var serviceConstante = require(__dirname + "/get-constante.js");
var rp = require('request-promise');


var Framework = sequelizeFramework(serviceConstante);
var Experience = sequelizeExperience(serviceConstante);
var Categorie = sequelizeCategorie(serviceConstante);
var ExperienceFramework = sequelizeExperienceFramework(serviceConstante);



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
Framework.sync();
Experience.sync();
Categorie.sync();
ExperienceFramework.sync();

exports.getCategories = function (req, res) {

	Categorie.findAll().then(categories => {


		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send(categories);
		//res.end();
	})


};
exports.getFrameworks = function (req, res) {

	Framework.findAll().then(frameworks => {


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
		id: req.body.experience_id
	};


	if (typeof experience.id === "undefined") 
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