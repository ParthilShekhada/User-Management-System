require('dotenv').config()
const express=require('express')
const cookieParser = require('cookie-parser')
const app=express()
const bcrypt=require('bcryptjs')
const path=require('path')
require("./db/conn")
// const auth=require("./middleware/auth")
const register=require("./models/register")
const hbs=require("hbs")
const flash = require('connect-flash');
const session = require('express-session');
const port=process.env.PORT ||4000

//this is used for the get form data
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

const userRouter=require("./router/user")
app.use(userRouter)




//middleware
const static_path=path.join(__dirname,"./public")
const template_path=path.join(__dirname,"./templates/views")
const partial_path=path.join(__dirname,"./templates/partials")

app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",template_path)
hbs.registerPartials(partial_path)
hbs.registerHelper('equal', function(value1, value2) {
    return value1 === value2;
  });
  


app.listen(port,()=>{
    console.log("Your url is http://localhost:"+port)
})