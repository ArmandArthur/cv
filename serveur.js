

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



app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

var serviceAuth =  require(__dirname + "/get-auth.js");

// API
var api = express();
var preindexApi = express();

api.get("/categories",  serviceAuth.token_api,serviceApi.getCategories);
api.get("/frameworks",  serviceAuth.token_api,serviceApi.getFrameworks);
api.get("/experiences",  serviceAuth.token_api,serviceApi.getExperiences);
api.get("/categorie/:categorie_value",  serviceAuth.token_api,serviceApi.getCategorieByValue);
api.get("/frameworks/categorie/:categorie_value",  serviceAuth.token_api,serviceApi.getFrameworksByCategorieValue);
api.get("/utilisateur/:ip",  serviceAuth.token_api,serviceApi.getUtilisateurByIp);
api.get("/framework/:nom",  serviceAuth.token_api,serviceApi.getFrameworkByNom);

api.get("/categorie_request",  serviceAuth.token_api, serviceApi.getCategorieRequest);
api.get("/framework_request",  serviceAuth.token_api,serviceApi.getFrameworkRequest);
api.get("/experience_request",  serviceAuth.token_api,serviceApi.getExperienceRequest);

api.post("/categorie_crud", serviceAuth.token_api, serviceApi.categorie); 
api.post("/framework_crud", serviceAuth.token_api,  serviceApi.framework); 
api.post("/experience_crud", serviceAuth.token_api, serviceApi.experience); 
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
app.get('/', function(req, res){
    res.sendFile(__dirname + '/preindex.html');
});

http.createServer(app).listen(PORT);


