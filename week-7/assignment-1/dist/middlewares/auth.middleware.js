import jwt from 'jsonwebtoken';
const jwtAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.trim().replace('Bearer ', '');
    if (token) {
        const Secret = process.env.JWT_SECRET || "";
        jwt.verify(token, Secret, (err, user) => {
            if (err || !user) {
                return res.status(403).send(`Forbidden: Invalid token`);
            }
            const payload = user;
            req.user_id = payload.id;
            next();
        });
    }
    else {
        res.status(401).send('Unauthorized: No token provided');
    }
};
export { jwtAuth };
