const express=require("express")
const router=express.Router()
const verifyToken = require('../middleware/auth')


const {getLogin,postLogin,postRegister,getIndex,getLogout,getWeather,getAdmin, getAdminById, getAddUser, postAddUser, getEditUser, postEditUser, deleteUser,getProfile,getEditProfile,postEditProfile, getForgotPassword,postForgotPassword,getUpdatePassword,updatePassword, getDatabase, getRegisterUser, getActiveUser, getInActiveUser} = require("../controller/user")

router.get("/",getLogin)
router.post("/",postLogin)
router.post("/register",postRegister)
router.get("/index",verifyToken,getIndex)
router.get("/logout",verifyToken,getLogout)
router.get("/weather",verifyToken,getWeather)
router.get("/admin",verifyToken,getAdmin)
router.get("/profile",verifyToken,getProfile)
router.get("/adduser",verifyToken,getAddUser)
router.post("/adduser",verifyToken,postAddUser)
router.get("/edituser/:id",verifyToken,getEditUser)
router.post("/edituser/:id",verifyToken,postEditUser)
router.get("/editprofile/:id",verifyToken,getEditProfile)
router.post("/editprofile/:id",verifyToken,postEditProfile)
router.get("/admin/:id",verifyToken,deleteUser)
router.get("/viewuser/:id",verifyToken,getAdminById)
router.get("/forgotpassword",getForgotPassword)
router.post("/forgotpassword",postForgotPassword)
router.get('/update-password', getUpdatePassword);
router.post('/update-password', updatePassword);//update password-->put
router.get('/database',verifyToken,getDatabase);
router.get('/registeruser',verifyToken,getRegisterUser);
router.get('/activeuser',verifyToken,getActiveUser);
router.get('/inactiveuser',verifyToken,getInActiveUser);

module.exports=router