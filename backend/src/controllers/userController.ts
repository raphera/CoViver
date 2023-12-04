import db from '../database';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const existingUser = await db('Users').where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [userId] = await db('Users').insert({ name, email, password_hash: hashedPassword });
        res.status(201).json({ userId });
    } catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};


export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await db('Users').where({ user_id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await db('Users').select('*').whereNot('password_hash', null).orderBy('name');

        const usersWithoutPassword = users.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json(usersWithoutPassword);
    } catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await db('Users').where({ user_id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        await db('Users').where({ user_id: req.params.id }).delete();
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
}