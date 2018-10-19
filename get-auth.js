const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.info(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "ArthurMaelleProgrammation-3.0");
        req.email = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error
        });
    }
};