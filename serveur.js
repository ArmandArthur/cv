

var http = require('http');
var express = require('express');
var logger = require('morgan');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var serviceApi = require(__dirname + "/get-api.js");
var cors = require('cors');

var PORT = 8085;
var app = express();
app.use(logger(':method :url'));
app.use(serveStatic(__dirname));


app.use(bodyParser.json());
app.use(cors());


// API
var api = express();
api.get("/categories", serviceApi.getCategories);
api.get("/frameworks", serviceApi.getFrameworks);
api.get("/experiences", serviceApi.getExperiences);
api.get("/categorie/:categorie_label/frameworks", serviceApi.getFrameworksByCategorieValue);

api.post("/categorie_crud", serviceApi.categorie); 
api.post("/framework_crud", serviceApi.framework); 
api.post("/experience_crud", serviceApi.experience); 

app.use("/api", api);


http.createServer(app).listen(PORT);


