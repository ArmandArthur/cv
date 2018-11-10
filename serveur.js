

var http = require('http');
var express = require('express');
var logger = require('morgan');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var serviceApi = require(__dirname + "/get-api.js");
var serviceAuth =  require(__dirname + "/get-auth.js");

var cors = require('cors');
var session = require('express-session')


var PORT = 8085;
var app = express();
app.use(logger(':method :url'));
app.use(serveStatic(__dirname+"/preindex.html"));


app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}));








// API
var api = express();
var preindexApi = express();

api.get("/categories",  [serviceAuth,serviceApi.getCategories]);
api.get("/frameworks",  [serviceAuth,serviceApi.getFrameworks]);
api.get("/experiences",  [serviceAuth,serviceApi.getExperiences]);
api.get("/categorie/:categorie_value",  [serviceAuth,serviceApi.getCategorieByValue]);
api.get("/frameworks/categorie/:categorie_value",  [serviceAuth,serviceApi.getFrameworksByCategorieValue]);
api.get("/utilisateur/:ip",  [serviceAuth,serviceApi.getUtilisateurByIp]);
api.get("/framework/:nom",  [serviceAuth,serviceApi.getFrameworkByNom]);

api.get("/categorie_request",  [serviceAuth, serviceApi.getCategorieRequest]);
api.get("/framework_request",  [serviceAuth,serviceApi.getFrameworkRequest]);
api.get("/experience_request",  [serviceAuth,serviceApi.getExperienceRequest]);

api.post("/categorie_crud", [serviceAuth, serviceApi.categorie]); 
api.post("/framework_crud", [serviceAuth,  serviceApi.framework]); 
api.post("/experience_crud", [serviceAuth, serviceApi.experience]); 
//api.post("/utilisateur_crud", serviceApi.utilisateur); 

preindexApi.post("/inscription_crud", serviceApi.inscription);
preindexApi.get("/categories",  serviceApi.getCategories);

app.use(session({
  secret: 'lafouine',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use("/api", api);
app.use("/preindexapi", preindexApi);
http.createServer(app).listen(PORT);


