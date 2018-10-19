

var http = require('http');
var express = require('express');
var logger = require('morgan');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var serviceApi = require(__dirname + "/get-api.js");

var cors = require('cors');
var session = require('express-session')
const jwt = require('jsonwebtoken');
var url = require('url');

var PORT = 8085;
var app = express();
app.use(logger(':method :url'));
app.use(serveStatic(__dirname+"/preindex.html"));


app.use(bodyParser.json());
app.use(cors({origin: 'http://armand-arthur.com	'}))
app.use(bodyParser.urlencoded({
  extended: true
}));

//var serviceAuth =  require(__dirname + "/get-auth.js");





exports.token_api = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "ArthurMaelleProgrammation-3.0");
        next();
    } catch (error) {

       //res.redirect('http://armand-arthur.com/preindex.html');
       return res.status(401).json({
            message: error
        });

            
    }
};

// API
var api = express();
var preindexApi = express();

api.get("/categories",  exports.token_api,serviceApi.getCategories);
api.get("/frameworks",  exports.token_api,serviceApi.getFrameworks);
api.get("/experiences",  exports.token_api,serviceApi.getExperiences);
api.get("/categorie/:categorie_value",  exports.token_api,serviceApi.getCategorieByValue);
api.get("/frameworks/categorie/:categorie_value",  exports.token_api,serviceApi.getFrameworksByCategorieValue);
api.get("/utilisateur/:ip",  exports.token_api,serviceApi.getUtilisateurByIp);
api.get("/framework/:nom",  exports.token_api,serviceApi.getFrameworkByNom);

api.get("/categorie_request",  exports.token_api, serviceApi.getCategorieRequest);
api.get("/framework_request",  exports.token_api,serviceApi.getFrameworkRequest);
api.get("/experience_request",  exports.token_api,serviceApi.getExperienceRequest);

api.post("/categorie_crud", exports.token_api, serviceApi.categorie); 
api.post("/framework_crud", exports.token_api,  serviceApi.framework); 
api.post("/experience_crud", exports.token_api, serviceApi.experience); 
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


