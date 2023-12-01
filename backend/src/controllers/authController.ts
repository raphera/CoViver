import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../database';
import { UserForTokenModel } from '../models/UserForTokenModel';

const secretKey = process.env.SECRET_KEY;

const refreshTokens: { [key: string]: string } = {};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await db('Users').where({ email }).first();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        if (!secretKey) {
            throw new Error('Secret key is empty');
        }

        const userForToken: UserForTokenModel = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        };

        const accessToken = jwt.sign(userForToken, secretKey, { expiresIn: '15m' });

        const refreshToken = jwt.sign(userForToken, secretKey, { expiresIn: '7d' });

        refreshTokens[refreshToken] = email;

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
    }
};


export const refresh = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token || !(token in refreshTokens)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
        if (!secretKey) {
            throw new Error('Secret key is empty');
        }

        const user = jwt.verify(token, secretKey) as jwt.JwtPayload & UserForTokenModel;

        delete user.exp;
        delete user.iat;

        const newAccessToken = jwt.sign(user, secretKey, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign(user, secretKey, { expiresIn: '7d' });

        delete refreshTokens[token];
        refreshTokens[newRefreshToken] = user.email!;

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error(error);
    }
};

export const logout = (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Token is required' });
    }

    if (!(refreshToken in refreshTokens)) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    delete refreshTokens[refreshToken];

    res.json({ message: 'Logged out successfully' });
};