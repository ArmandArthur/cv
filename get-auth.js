const jwt = require('jsonwebtoken');
var url = require('url');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "ArthurMaelleProgrammation-3.0");
        next();
    } catch (error) {
            res.redirect('http://armand-arthur.com');
            
    }
};