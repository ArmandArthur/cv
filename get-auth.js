
const jwt = require('jsonwebtoken');
var url = require('url');

exports.token_api = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "ArthurMaelleProgrammation-3.0");
        next();
    } catch (error) {
        /*return res.status(401).json({
            message: '401'
        });*/
        res.setHeader('Access-Control-Allow-Origin', 'http://armand-arthur.com');
        res.redirect('/');
            
    }
};