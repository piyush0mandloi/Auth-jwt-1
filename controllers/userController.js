import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class UserController {
    static userRegistration = async (req, res)=>{
        const {name, email, password, password_confirmation, tc} = req.body

        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed", "message":"Email already exists"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password == password_confirmation){
                    try{
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({email:email})

                        // Generate JWT Token
                        const token = jwt.sign({userId:saved_user._id}, process.env.JWT_SECRET, {expiresIn:'2d'})


                        res.status(201).send({"status":"success", "message":"User registered successfully", "token":token})
                    }catch(error){
                        console.log(error);
                        res.send({"status":"failed", "message":"Unable to register"})
                    }
                }else{
                    res.send({"status":"failed", "message":"Password Doesn't match"})

                }
            }else{
                res.send({"status":"failed", "message":"All fields required"})

            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const {email, password} = req.body
            if(email && password){
                const user = await UserModel.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if(isMatch && user.email === email){

                        // Generate JWT Token
                        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'2d'})
                        res.send({"status":"success", "message":"Login Success", "token":token, "user":{id:user._id, name:user.name, email:user.email}})

                    }else{
                        res.send({"status":"failed", "message":"Email or Password is not valid"})

                    }
                }else{
                    res.send({"status":"failed", "message":"You are not registered user"})
                }
            }else{
                res.send({"status":"failed", "message":"All fields are requied"})
            }
        } catch (error) {
            
        }
    }

    static changeUserPassword = async (req, res) => {
    const {password, password_confirmation} = req.body
    if(password && password_confirmation){
        if(password !== password_confirmation){
            res.send({"status":"failed", "message":"Password doesn't match"})
        } else{
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await UserModel.findByIdAndUpdate(req.user._id, { password: newHashPassword })
            res.send({"status":"success", "message":"Password changed successfully"})
        }
    }else{
        res.send({"status":"failed", "message":"All fields are required"})
    }
    }

    static loggedUser = async (req, res)=>{
        res.send({"user":req.user})
    }


    static sendUserPasswordResetLink = async (req, res) => {
        const {email} = req.body
        if(email){
            const user = await UserModel.findOne({email:email})
            if(user){
                const secret = user._id + process.env.JWT_SECRET
                const token =  jwt.sign({userId: user._id}, secret, {expiresIn:'15m'})
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link);
                res.send({"status":"success", "message":"Email Send for password resetting"})
            }else{
                res.send({"status":"failed", "message":"Email Fdoesn't exist"})

            }
        }else{
            res.send({"status":"failed", "message":"Email Field id required"})
        }
    }

    static userPasswordReset = async (req, res)=>{
        const {password, password_confirmation} = req.body
        const {id, token} = req.params

        const user = await UserModel.findById(id)
        const new_token = user._id + process.env.JWT_SECRET

        try {
            jwt.verify(token, new_token)
            if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status":"failed", "message":"Password doesn't match"})
                }else{
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(id, { password: newHashPassword })
                    res.send({"status":"success", "message":"Password changed successfully"})
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required"})
            }
            
        } catch (error) {
            res.send({"status":"failed", "message":"Invalid token"})
        }
        
    }




}

export default UserController