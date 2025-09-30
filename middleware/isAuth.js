const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Not authenticated. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Not authenticated. Token invalid.' });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    // Authentication successful
    req.userId = decodedToken.id;
    next();
};