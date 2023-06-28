const flash = require('connect-flash');
const register = require("../models/register")
const bcrypt = require('bcryptjs')
const nodemailer  = require("nodemailer")
const randomstring = require("randomstring");



const userController = {
    getLogin: async (req, res) => {
            res.render('login')
    },

    postLogin: async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const role = req.body.role

            const userEmail = await register.findOne({ email: email })
            const isMatch = await bcrypt.compare(password, userEmail.password)

            const token = await userEmail.generateAuthToken()
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 6000000000),
                httpOnly: true
            })

            if (isMatch) {
                const _id=userEmail._id
                if (userEmail.role == role && role == 'user') {
                    const userData = await register.findByIdAndUpdate(_id,{ status:'active'}, {
                        new: true
                    })
                    res.redirect('index')
                }
                else if (userEmail.role == role && role == 'admin') {
                    const userData = await register.findByIdAndUpdate(_id,{ status:'active'}, {
                        new: true
                    })
                    res.redirect('/admin')
                }
                else {
                    res.render('login', { alert: "Invalid login details"})
                }
            }
            else {

                res.render('login', { alert: "Invalid login details" })
            }
        } catch (error) {
            res.render('login', { alert: "Invalid login details" })
        }
    },

    postRegister: async (req, res) => {
        try {
            const role = req.body.role
            const password = req.body.password
            const cpassword = req.body.confirmpassword
            if (password === cpassword) {
                const registerEmployee = new register({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: req.body.role,
                    password: req.body.password,
                    confirmpassword: req.body.confirmpassword,
                })
                const token = await registerEmployee.generateAuthToken()
                console.log('hello')


                await registerEmployee.save()
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 60000000000),
                    httpOnly: true
                })

                if (role == 'user') {
                    res.redirect('/index')
                }
                else if (role == 'admin') {
                    res.redirect('/admin')
                }
            }
            else {
                res.render('login', { alert: 'Your password does not matched' })
            }
        } catch (error) {
            res.render('login', { alert: 'Your password does not matched' })
        }
    },

    getIndex: (req, res) => {
        const role = req.user.role
        res.render('index', { role })
    },

    getLogout: async (req, res) => {
        try {
            //         // for single logout
            //         // req.user.tokens=req.user.tokens.filter((element)=>{
            //         //     return element!=req.token  
            //         // })

            //         // if upper code doesn't work
            //         // let tokenObj=req.user.tokens
            //         // let token=`${req.token}`
            //         // let tokenIndex;
            //         // for(let i=0; i<=tokenObj.length; i++){
            //         //     if(tokenObj[i].token==token){
            //         //         tokenObj.splice(i,1)
            //         //     }
            //         // }



            //for multuiple 
            const _id=req.user._id
            const userData = await register.findByIdAndUpdate(_id,{ status:'Inactive'}, {
                new: true
            })
            req.user.tokens = []

            res.clearCookie("jwt")
            console.log("logout succesfully")
            await req.user.save()
            res.render('login')
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getWeather: async (req, res) => {
        const role = req.user.role
        res.render('weather')
    },
    getAdmin: async (req, res) => {
        // const rows = await register.find()
        res.render('default-admin')
    },
    getDatabase: async (req, res) => {
        const rows = await register.find()
        // res.render('admin', { rows})
        res.render('admin', { rows, alert: req.flash('alert')})
    },
    getRegisterUser: async (req, res) => {
        const rows = await register.find()
        res.render('register-admin', { rows, role: 'admin' })
    },
    getActiveUser: async (req, res) => {
        const rows = await register.find({status:'active'})

        res.render('register-admin', { rows, role: 'admin' })
    },
    getInActiveUser: async (req, res) => {
        const rows = await register.find({status:'Inactive'})
        res.render('register-admin', { rows, role: 'admin' })
    },
    

    getAdminById: async (req, res) => {
        try {
            const id = req.params.id
            const rows = await register.find({ _id: id })
            res.render('view-user', { rows, role: 'admin' })

        } catch (error) {
            res.status(500).send(error)
        }
    },

    getAddUser: async (req, res) => {
        res.render('add-user');
    },

    postAddUser: async (req, res) => {
        try {
            const password = req.body.password
            const cpassword = req.body.confirmpassword
            if (password === cpassword) {
                const registerEmployee = new register({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: req.body.role,
                    password: req.body.password,
                    confirmpassword: req.body.confirmpassword,
                })


                await registerEmployee.save()
                console.log('user saved')
                const rows = await register.find()

                res.status(201).render('admin', { role: 'admin',alert:'User added successfully',rows})

            }
            else {
                res.render('add-user', { alert: 'Your password does not matched' })
            }

        } catch (error) {
            res.render('add-user', { alert: error})
        }
    },

    getEditUser: async (req, res) => {
        try {
            const id = req.params.id
            const rows = await register.find({ _id: id })
            res.render('edit-user', { rows, role: 'admin' })

        } catch (error) {
            res.status(500).send(error)
        }
    },
    postEditUser: async (req, res) => {
        try {
            const _id = req.params.id
            console.log('hello')

            const userData = await register.findByIdAndUpdate(_id, req.body, {
                new: true
            })
            const rows = await register.find()
            req.flash('alert', 'User data updated succesfullly!!.');
            // res.render('admin', { rows, role: 'admin',alert:'User updated Succesfully'}) 
            res.redirect('/database') 

        
            

        } catch (error) {
            res.status(500).send(error)
        }
    },

    deleteUser: async (req, res) => {
        try {
            const _id = req.params.id
            const deleteMens = await register.findByIdAndDelete(_id)
            const rows = await register.find()
            res.redirect('/database')


        } catch (error) {
            res.status(500).send(error)
        }
    },

    getProfile: async (req, res) => {

        try {
            const id = req.user.id
            const rows = await register.find({ _id: id })
            const role=req.user
            if(role==undefined){
                res.render('profile', { rows})
            }
            else{
                res.render('profile', { rows,role:req.user.role})
            }

        } catch (error) {
            res.status(500).send(error)
        }
    },

    getEditProfile: async (req, res) => {
        try {
            const id = req.params.id
            const rows = await register.find({ _id: id })
            res.render('edit-profile', { rows})
            // res.render('profile', { rows, role: 'admin' })

        } catch (error) {
            res.status(500).send(error)
        }
    },

    postEditProfile: async (req, res) => {
        try {
            const _id = req.params.id
            console.log('hello')

            const userData = await register.findByIdAndUpdate(_id, req.body, {
                new: true
            })
            const id = req.user.id
            const rows = await register.find({ _id: id })
            res.render('profile', { rows})

        } catch (error) {
            res.status(500).send(error)
        }
    },


    getForgotPassword: async (req, res) => {
       res.render('forgot-pass')
    },
    postForgotPassword :async(req,res)=>{
        
        try {
            const email = req.body.email;
            const userData = await register.findOne({email:email})
            
            if(userData){
                const randomString = randomstring.generate();
                const data = await register.updateOne({email:email},{$set:{passwordToken:randomString}})
                res.status(200).render('forgot-pass',{status:true,message:"Please check youe email inbox"})
                const firstname=userData.firstname
                const useremail=userData.email
                const token=randomString
                // const token = await registerEmployee.generateAatuToken();


                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    // service: process.env.SERVICE,
                    port: 587,
                    secure: false,
                    // requireTLS:true,
                    auth: {
                        user:"shekhadaparthil@gmail.com",
                        pass:"hlkh qytc drog zlsv",
                    },
                });
        
                const mailOption = {
                    from:"shekhadaparthil@gmail.com",
                    to:useremail,
                    subject: "For Reset Password",
                    html:`<p>Hii ${firstname}, Please copy the link  and <a href="http://localhost:4000/update-password?token=${token}">reset your password</a></p>`,
                }
                await transporter.sendMail(mailOption,(info,error)=>{
                    if(error){
                        console.log(error)
                    }else{
                        console.log("Mail send successfully!!!",info);
                    }
                });
        
                console.log("email sent sucessfully");



            }else{
                res.status(200).render('forgot-pass',{status:false,message:"Email does not exist into database. Please Sign Up!!"})
            }
        } catch (error) {
            res.status(400).send({status:false,message:error.message})
        }
    },


    getUpdatePassword:(req,res)=>{
        const token = req.query.token
        res.render("set-password",{token})
    },

    updatePassword:async(req,res)=>{
        try {console.log("hellio");
            const token = req.query.token
            console.log("query-token--->"+token);
            const tokenData = await register.findOne({passwordToken:token})
            console.log("query-tokenData--->"+tokenData);
            if(tokenData){
                    const password = req.body.password
                    console.log("password---->"+password);
                    const securePassword = await bcrypt.hash(password, 10)
                    console.log("securePassword---->"+securePassword);
                    console.log(("tokenData._id----->"+tokenData._id));
                    const result = await register.findByIdAndUpdate({_id:tokenData._id},{$set:{password:securePassword,passwordToken:""}},{new:true})
                    res.render('login',{status:true,message:"Password Updated Successfully!!",data:result}) 
            }else{
                res.render('set-password',{status:false,message:"Link was expired"}) 
            }
        } catch (error) {
            res.status(400).send({status:false,message:error.message}) 
        }
    }







}



module.exports = userController