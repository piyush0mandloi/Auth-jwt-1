import express from 'express'
const router = express.Router()
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/auth-middleware.js'

// Middleware to check if user is authenticated
router.use('/changepassword', checkUserAuth)
router.get('/loggeduser', checkUserAuth)


// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/sendpasswordresetlink', UserController.sendUserPasswordResetLink)
router.post('/resetpassword/:id/:token', UserController.userPasswordReset)

// protected routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)


export default router

// pi/user/reset//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk1ZTk2NTgyZjA1YTc0YzQ0MzQxYzciLCJpYXQiOjE3NTQ3MDgyMzMsImV4cCI6MTc1NDcwOTEzM30.8m4R1CMTN9Vdz5JxGc2WvT8ZXLG5EBSuNcCKcmmcuFo