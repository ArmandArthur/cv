var serviceConstante = require(__dirname + "/get-constante.js");
var rp = require('request-promise');
var request = require('request');
var bcrypt = require('bcryptjs');
var url = require('url');
var jwt = require('jsonwebtoken');  

var Framework = sequelizeFramework(serviceConstante);
var Experience = sequelizeExperience(serviceConstante);
var Categorie = sequelizeCategorie(serviceConstante);
var ExperienceFramework = sequelizeExperienceFramework(serviceConstante);
var Utilisateur = sequelizeUtilisateur(serviceConstante);
var Requete = sequelizeRequete(serviceConstante);
var UtilisateurRequete = sequelizeRequeteUtilisateur(serviceConstante);

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
Utilisateur.associate = function () {
	Utilisateur.belongsToMany(Requete, {
		as: 'requetes',
		through: 'requeteutilisateur',
		foreignKey: 'utilisateurId'
	});
};
Requete.associate = function () {
	Requete.belongsToMany(Utilisateur, {
		as: 'utilisateurs',
		through: 'requeteutilisateur',
		foreignKey: 'requeteId'
	});
	UtilisateurRequete.belongsTo(Requete, {
		foreignKey: 'requeteId'
	})

};

exports.associateGlobale = function () {
	Framework.associate();
	Experience.associate();
	Utilisateur.associate();
	Requete.associate();	

}
exports.associateGlobale();

setTimeout(function(){ ExperienceFramework.sync(); }, 1200);
setTimeout(function(){ Categorie.sync(); }, 1800);
setTimeout(function(){ Framework.sync(); },2400);
setTimeout(function(){ Experience.sync(); }, 3000);
setTimeout(function(){ Utilisateur.sync(); }, 3600);
setTimeout(function(){ Requete.sync(); }, 4200);
setTimeout(function(){ UtilisateurRequete.sync(); }, 4600);


exports.verificationCaptcha = function (req, res, next) {
	console.info(req.body);
 if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) 
 {
    return res.sendStatus(404);
  }
  var secretKey = "6LfsiHUUAAAAAJgzd6dFvKfRnJvXeoWvFQBwpjlU";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.sendStatus(403);
    }
    exports.utilisateur_inscription(req, res, next);
  });

}

exports.inscription = function (req, res, next) {
	exports.verificationCaptcha(req, res, next); 

};

exports.utilisateur_inscription = function (req, res, next) {
  Utilisateur.findOne({where : {
				email: req.body.email 
	}})
    .then(user => {
      if (user !=  null) {
        return res.status(409).json({
          message: "Email déjà utilisé..."
        });
      } else {

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) 
          {
            return res.status(500).json({
              error: err
            });
          } else 
          {
          		const utilisateur = {
          			email : req.body.email,
          			hash : hash
          		}
          		Utilisateur.create(utilisateur).then((utilisateurItem) => {
					Utilisateur.findOne({
						where: {
							'id': utilisateurItem.get('id')
						}
					}).then(utilisateur => {
					  var token = jwt.sign({
					    email: utilisateur.get('email')
					  }, 'ArthurMaelleProgrammation-3.0');
					  							

					    res.redirect(url.format({
					       pathname: encodeURI("http://armand-arthur.com/index.html"),
					       query: {
					          "token": token
					        }
					     }));
 
						
					})
				})
          }
    });
});

      }
  });

};


exports.getCategorieRequest = function (req, res) {

	Requete.findOne({
			where : {
				value : 'categorie_crud'
			}
		}).then(requete => {
			res.send(requete);
	})


};
exports.getFrameworkRequest = function (req, res) {

	Requete.findOne({
			where : {
				value : 'framework_crud'
			}
		}).then(requete => {
			res.send(requete);
	})


};
exports.getExperienceRequest = function (req, res) {

	Requete.findOne({
			where : {
				value : 'experience_crud'
			}
		}).then(requete => {
			res.send(requete);
	})


};
exports.getCategories = function (req, res) {

	Categorie.findAll().then(categories => {
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
		
		res.send(experiences);
		//res.end();
	})


};

exports.getCategorieByValue = function (req, res) {


	Categorie.findOne({
			where : {
				value : req.params.categorie_value
			}
		})
		.then(categorie => {
			res.send(categorie);
		})


};

exports.getUtilisateurByIp = function (req, res) {


	Utilisateur.findOne({
			where : {
				ip : req.params.ip
			}
		})
		.then(utilisateur => {
			res.send(utilisateur);
		})


};

exports.getFrameworkByNom = function (req, res) {


	Framework.findOne({
			where : {
				nom : req.params.nom
			},
			include: [{
				model: Categorie,
				as: 'categorie'
			}]
		})
		.then(framework => {
			res.send(framework);
		})


};

exports.categorie_crud = function (req, res, utilisateurRequete) {
	console.info(utilisateurRequete);
	if(utilisateurRequete.get('nombre') < utilisateurRequete.get('requete').get('max_limit'))
	{
			const categorie = {
				label: req.body.categorie_nom,
				value: req.body.categorie_nom,
				level: req.body.categorie_level,
				id: req.body.categorie_id
			};
			if (req.body.categorie_id != null) {
				Categorie.update(categorie, {
					where: {
						id: categorie.id
					}
				}).then(() => {

					Categorie.findOne({
						where: {
							'id': req.body.categorie_id
						}
					}).then(categorie => {
						res.json(
							{
								"categorie": categorie,
								"nombre" : utilisateurRequete.get('nombre')
							}
						)
					})
				})
			} else {

				Categorie.create(categorie).then((categorieItem) => {
					Categorie.findOne({
						where: {
							'id': categorieItem.get('id')
						}
					}).then(categorie => {
						res.json(
							{
								"categorie": categorie,
								"nombre"  : utilisateurRequete.get('nombre')
							}
						)
					})
				})
			}
	}
	else{
		res.sendStatus(403);
	}
}
exports.categorie = function (req, res) {




	UtilisateurRequete.findOne({
										
			include: [{
				model: Requete,

				where : {
					value : "categorie_crud",
					utilisateurId : req.email
				},	
			}]

			}).then(utilisateurRequest => {
				const nombre = 1;
					if(utilisateurRequest != null )
					{
						userRequestConstante = {
							requeteid :  utilisateurRequest.get('id'),
							nombre :  parseInt(utilisateurRequest.get('nombre')+1),
							utilisateurId : 1
						}
						nombre = userRequestConstante.nombre; 
						UtilisateurRequete.update(userRequestConstante, {
									where: {
										id: utilisateurRequest.get('id')
									}
								}).then(() => {

			UtilisateurRequete.findOne({
										
			include: [{
				model: Requete,

				where : {
					value : "categorie_crud",
					utilisateurId : req.email
				},	
			}]

			}).then(response => {
				exports.categorie_crud(req, res, response);
			})
		})
						
					}
					else
					{
						 userRequestConstante = {
							
							nombre :  1,
							requeteId : 1,
							utilisateurId: 1
						}						
						UtilisateurRequete.create(userRequestConstante).then((utilisateurRequetes) => {
			UtilisateurRequete.findOne({
										
			include: [{
				model: Requete,

				where : {
					value : "categorie_crud",
					utilisateurId : req.email
				},	
			}]

			}).then(response => {
				exports.categorie_crud(req, res, response);
			})
		});
					}

					

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

exports.getFrameworksByCategorieValue = function (req, res) {

	Categorie.findOne({
			where : {
				value : req.params.categorie_value
			}
		})
		.then(categorie => {
			console.info(categorie)
			Framework.findAll({
					include: [{
						model: Categorie,
						where: {
							id: categorie.get('id')
						}
					}]
				})
				.then(frameworks => {
					res.send(frameworks);
				})
	})




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
		},
		level: {
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
		hash: {
			type: serviceConstante.Sequelize.STRING
		},		
		ip: {
			type: serviceConstante.Sequelize.STRING
		}
	});


}

function sequelizeRequete(serviceConstante) {
	return serviceConstante.sequelize.define('requete', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		value: {
			type: serviceConstante.Sequelize.STRING
		},
		max_limit: {
			type: serviceConstante.Sequelize.INTEGER
		}
	});


}

function sequelizeRequeteUtilisateur(serviceConstante) {
	return serviceConstante.sequelize.define('requeteutilisateur', {
		id: {
			type: serviceConstante.Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		requeteId: {
			type: serviceConstante.Sequelize.INTEGER
		},
		utilisateurId: {
			type: serviceConstante.Sequelize.INTEGER
		},
		nombre: {
			type: serviceConstante.Sequelize.INTEGER
		}		
	}, {
		tableName: 'requeteutilisateur'
	});
}