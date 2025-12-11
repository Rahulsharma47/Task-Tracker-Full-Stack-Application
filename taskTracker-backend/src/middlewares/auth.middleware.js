import {asyncHandler} from '../utils/asyncHandler.js' 
import APIError from '../utils/API_Error.js'
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler( async (req, res, next)=>{
    try {
        console.log('🍪 Cookies:', req.cookies);
        console.log('📋 Headers:', req.headers);
        console.log('🔑 Auth Header:', req.header('Authorization'));

        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        console.log('✅ Token found:', !!token);

        if(!token){
            throw new APIError(401, 'Unauthorized request');
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        );
        if (!user) {
            throw new APIError(401, 'Invalid access token');
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('❌ Auth error:', error.message);
        throw new APIError(401, error?.message || 'Invalid access token');
    }
})
