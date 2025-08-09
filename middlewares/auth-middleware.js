import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

var checkUserAuth = async (req, res, next) => {
    let token
    const { authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token=authorization.split(' ')[1]            

            // verify token
            const {userId} = jwt.verify(token, process.env.JWT_SECRET)

            // get user from token
            req.user = await UserModel.findById(userId).select('-password')
            next()
        } catch (error) {
            console.log(error);
            res.status(401).send({"status":"failed", "message":"Unauthorized User"})
            
        }
    }
    if(!token){
        res.status(401).send({"status":"failed", "message":"Unauthorized User, No token provided"})
    }
}

export default checkUserAuth;