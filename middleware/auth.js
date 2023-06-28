const jwt=require('jsonwebtoken')
const register=require('../models/register')


const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt
       
        const verifyUser=jwt.verify(token,process.env.SECERET_KEY)
       

        const user=await register.findOne({_id:verifyUser._id})

        req.token=token
        req.user=user
        next()

    } catch (error) {
        res.render("login",{note:'Plz login to access this page'})
    }
}

module.exports=auth