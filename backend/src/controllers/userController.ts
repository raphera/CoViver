import db from '../database';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

exports.createUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users1']
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


exports.getUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    try {
        const user = await db('Users').where({ user_id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
