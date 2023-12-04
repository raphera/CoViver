import { UserForTokenModel } from '../models/UserForTokenModel';
import { Request } from 'express';

export interface RequestWithUserModel extends Request {
    user?: UserForTokenModel;
}