const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isLoggedIn = false
        return res.status(401).json({ message: 'Not authenticated. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        req.isLoggedIn = false
        return res.status(401).json({ message: 'Not authenticated. Token invalid.' });
    }

    if (!decodedToken) {
        req.isLoggedIn = false
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    // Authentication successful
    req.userId = decodedToken.id;
    req.isLoggedIn = true;
    next();
};