import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express-serve-static-core';

interface IRequest extends Request {
    user_id?: string;
}

interface IJWTPayload {
    id: string;
}

const jwtAuth = (req: IRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers['authorization']?.trim().replace('Bearer ', '');
    if (token) {
        const Secret: string = process.env.JWT_SECRET || "";
        jwt.verify(token, Secret, (err, user) => {
            if (err || !user) {
                return res.status(403).send(`Forbidden: Invalid token`);
            }

            const payload = user as IJWTPayload;
            req.user_id = payload.id;
            next();
        });
    } else {
        res.status(401).send('Unauthorized: No token provided');
    }
}

export { jwtAuth };