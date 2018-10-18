

var http = require('http');
var express = require('express');
var logger = require('morgan');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var serviceApi = require(__dirname + "/get-api.js");
var cors = require('cors');
var session = require('express-session')

var PORT = 8085;
var app = express();
app.use(logger(':method :url'));
app.use(serveStatic(__dirname+"/preindex.html"));


app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

// API
var api = express();
var preindexApi = express();

api.get("/categories", serviceApi.getCategories);
api.get("/frameworks", serviceApi.getFrameworks);
api.get("/experiences", serviceApi.getExperiences);
api.get("/categorie/:categorie_value", serviceApi.getCategorieByValue);
api.get("/frameworks/categorie/:categorie_value", serviceApi.getFrameworksByCategorieValue);
api.get("/utilisateur/:ip", serviceApi.getUtilisateurByIp);
api.get("/framework/:nom", serviceApi.getFrameworkByNom);

api.get("/categorie_request", serviceApi.getCategorieRequest);
api.get("/framework_request", serviceApi.getFrameworkRequest);
api.get("/experience_request", serviceApi.getExperienceRequest);

api.post("/categorie_crud", serviceApi.categorie); 
api.post("/framework_crud", serviceApi.framework); 
api.post("/experience_crud", serviceApi.experience); 
//api.post("/utilisateur_crud", serviceApi.utilisateur); 

preindexApi.post("/inscription_crud", serviceApi.inscription);


app.use(session({
  secret: 'lafouine',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use("/api", api);
app.use("/preindexapi", preindexApi);

http.createServer(app).listen(PORT);


