const jwt = require('jsonwebtoken');
var url = require('url');

module.exports = (req, res, next) => {
    try {
        console.info(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        if(token == 'undefined')
        {
            res.redirect(url.format({
               pathname: "/preindex.html",
             }));
        }
        const decoded = jwt.verify(token, "ArthurMaelleProgrammation-3.0");
        req.email = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error
        });
    }
};