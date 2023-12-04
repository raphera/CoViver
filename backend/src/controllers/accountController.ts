import { Response } from 'express';
import db from '../database';
import { RequestWithUserModel } from '../models/RequestWithUserModel';

const checkUserPermission = async (account_id: number, user_id: number) => {
    const accountUser = await db('Account_Users').where({ account_id, user_id }).first();
    return !!accountUser;
};

export const createAccount = async (req: RequestWithUserModel, res: Response) => {
    const { account_name, details, category_id, type_id } = req.body;
    try {
        if (req.user === undefined) {
            return res.status(401).json({ message: 'A valid access token is required' });
        }

        const [account_id] = await db('Accounts').insert({
            account_name,
            details,
            category_id,
            type_id
        });

        await db('Account_Users').insert({
            account_id,
            user_id: req.user.user_id,
            default_percentage: 100
        });

        res.status(201).json({ account_id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating account', error });
    }
};

export const deleteAccount = async (req: RequestWithUserModel, res: Response) => {
    const { account_id, new_account_id } = req.body;
    try {
        if (req.user === undefined) {
            return res.status(401).json({ message: 'A valid access token is required' });
        }

        // Check if the user has permission to delete the account
        const hasPermission = await checkUserPermission(account_id, req.user.user_id);
        if (!hasPermission) {
            return res.status(403).json({ message: 'User does not have permission to delete this account' });
        }

        // If a new_account_id is provided, migrate all transactions to the new account
        if (new_account_id) {
            const newAccountPermission = await checkUserPermission(new_account_id, req.user.user_id);
            if (!newAccountPermission) {
                return res.status(403).json({ message: 'User does not have permission to migrate transactions to the new account' });
            }
            await db('Transactions').where({ account_id }).update({ account_id: new_account_id });
        }
        // If no new_account_id is provided, delete all transactions associated with the account
        else {
            // TODO: Verificar deleção de transações
            await db('Transactions').where({ account_id }).del();
        }

        // Remove all associations of the account with users
        await db('Account_Users').where({ account_id }).del();

        // Delete the account
        await db('Accounts').where({ account_id }).del();

        res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};

export const updateAccount = async (req: RequestWithUserModel, res: Response) => {
    const { account_id, account_name, details, category_id, type_id } = req.body;
    try {
        if (req.user === undefined) {
            return res.status(401).json({ message: 'A valid access token is required' });
        }

        // Check if the user has permission to update the account
        const accountUser = await checkUserPermission(account_id, req.user.user_id);
        if (!accountUser) {
            return res.status(403).json({ message: 'User does not have permission to update this account' });
        }

        // Update the account details
        await db('Accounts').where({ account_id }).update({
            account_name,
            details,
            category_id,
            type_id
        });

        res.status(200).json({ message: 'Account updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating account', error });
    }
};

export const getAccountsByUser = async (req: RequestWithUserModel, res: Response) => {
    const { user_id } = req.params;
    try {
        const accounts = await db('Account_Users')
            .join('Accounts', 'Account_Users.account_id', 'Accounts.account_id')
            .where('Account_Users.user_id', user_id)
            .select('Accounts.*', 'Account_Users.default_percentage');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving accounts', error });
    }
};

export const getUsersByAccount = async (req: RequestWithUserModel, res: Response) => {
    const { account_id } = req.params;
    try {
        const users = await db('Account_Users')
            .join('Users', 'Account_Users.user_id', 'Users.user_id')
            .where('Account_Users.account_id', account_id)
            .select('Users.*', 'Account_Users.default_percentage');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

export const associateUser = async (req: RequestWithUserModel, res: Response) => {
    const { account_id, user_id } = req.body;
    try {
        if (req.user === undefined) {
            return res.status(401).json({ message: 'A valid access token is required' });
        }

        // Check if the user has permission to update the account
        const accountUser = await checkUserPermission(account_id, req.user.user_id);
        if (!accountUser) {
            return res.status(403).json({ message: 'User does not have permission to associate new users to this account' });
        }

        await db('Account_Users').insert({
            account_id,
            user_id,
            default_percentage: 0
        });

        res.status(201).json({ message: 'User associated with account' });
    } catch (error) {
        res.status(500).json({ message: 'Error associating user with account', error });
    }
};

export const dissociateUser = async (req: RequestWithUserModel, res: Response) => {
    const { account_id, user_id } = req.body;
    try {
        if (req.user === undefined) {
            return res.status(401).json({ message: 'A valid access token is required' });
        }

        // Check if the user has permission to update the account
        const accountUser = await checkUserPermission(account_id, req.user.user_id);
        if (!accountUser) {
            return res.status(403).json({ message: 'User does not have permission to dissociate users from this account' });
        }

        // Remove the association of the user with the account
        await db('Account_Users').where({ account_id, user_id }).del();

        // Calculate the total percentage remaining among the associated users
        const totalPercentageResult = await db('Account_Users').where({ account_id }).sum('default_percentage as total');
        const totalPercentage = totalPercentageResult[0].total;

        // Adjust the percentage of the remaining users to fill the remaining percentage
        const remainingUsers = await db('Account_Users').where({ account_id });
        for (const user of remainingUsers) {
            const newPercentage = user.default_percentage / totalPercentage.total * 100;
            await db('Account_Users').where({ account_id, user_id: user.user_id }).update({ default_percentage: newPercentage });
        }

        res.status(200).json({ message: 'User dissociated from account' });
    } catch (error) {
        res.status(500).json({ message: 'Error dissociating user from account', error });
    }
};

export const getAccountTypes = async (req: RequestWithUserModel, res: Response) => {
    try {
        const accountTypes = await db('Account_Types');
        res.status(200).json(accountTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving account types', error });
    }
};

export const getAccountCategories = async (req: RequestWithUserModel, res: Response) => {
    try {
        const accountCategories = await db('Account_Categories');
        res.status(200).json(accountCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving account categories', error });
    }
};