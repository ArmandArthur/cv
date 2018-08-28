var serviceConstante = require(__dirname + "/get-constante.js");

exports.getCategories = function(req, res) {
	var Categorie = sequelizeCategorie(serviceConstante);
	Categorie.findAll().then(categories => {


      res.setHeader('Access-Control-Allow-Origin','*') 
	  res.send(categories);
	  //res.end();
	})

	
};

exports.getFrameworksByCategorieValue = function(req, res) {
	var Categorie = sequelizeCategorie(serviceConstante);
	var Framework = sequelizeFramework(serviceConstante);

	jointure_categorie_framework(Categorie,Framework);
	//Categorie.sync()
	//Framework.sync()

	Framework.findAll({include: [{model:Categorie, where: {value: req.params.categorie_label} }]})
	.then(frameworks => {
      res.setHeader('Access-Control-Allow-Origin','*') 
	  res.send(frameworks);
	})

	
};

exports.categorie = function(req, res)
{
	var Categorie = sequelizeCategorie(serviceConstante);
	const categorie = Categorie.build(
		{
			label: req.query.categorie_nom,
			value : req.query.categorie_nom 
		}
	);
	categorie.save().then(() => {
	  res.setHeader('Access-Control-Allow-Origin','*')
	  res.send(categorie); 
	})
	
	
};

exports.framework = function(req, res)
{
	var Framework = sequelizeFramework(serviceConstante);
	var Categorie = sequelizeCategorie(serviceConstante);
	jointure_categorie_framework(Categorie,Framework);
	const framework =
		{
			id: req.query.framework_id ,
			nom: req.query.framework_nom ,
			version : req.query.framework_version,
			level : req.query.framework_level,
			categorie_id: req.query.categorie_id 
		}
	;
	console.info(framework);
	if(req.query.framework_id != null)
	{		
		Framework.update(framework, {where: {id: framework.id} }).then(() => {

		  res.setHeader('Access-Control-Allow-Origin','*')
			  Framework.findOne({
                where: {
                   'id': req.query.framework_id
                },
                include: [
                    {model: Categorie}
                ]
            }).then(frameworkCategorie => {
	  				res.send(frameworkCategorie); 
				})
		})		
	}
	else{

		Framework.create(framework).then((frameworkItem) => {
		  res.setHeader('Access-Control-Allow-Origin','*')
			  Framework.findOne({
                where: {
                   'id': frameworkItem.get('id')
                },
                include: [
                    {model: Categorie}
                ]
            }).then(frameworkCategorie => {
	  				res.send(frameworkCategorie); 
				})
		})	
	}


	
	
};

function sequelizeCategorie(serviceConstante){
	return serviceConstante.sequelize.define('categorie', {
			   label: {
			    type: serviceConstante.Sequelize.STRING
			  },
			  value: {
			    type: serviceConstante.Sequelize.STRING
			  }
			});
}

function sequelizeFramework(serviceConstante){
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
			  }
			  ,
			  level: {
			    type: serviceConstante.Sequelize.STRING
			  },
  			  categorie_id: {
			    type: serviceConstante.Sequelize.INTEGER
			  }
			});
}

function jointure_categorie_framework(Categorie,Framework){
	Framework.belongsTo(Categorie, {foreignKey: 'categorie_id'})
}
