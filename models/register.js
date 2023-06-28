const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const employeSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },  
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    passwordToken:{
        type:String,
        default:""
    },
    createdOn: {
        type: Date,
        default: Date.now
      },
    status: {
        type: String,
        default: "active"
    }
})

employeSchema.methods.generateAuthToken = async function () {
    try {
        
        const token = jwt.sign({ _id: this._id},process.env.SECERET_KEY)
        this.tokens=this.tokens.concat({token})
        await this.save();
        return token;
        
    } catch (error) {
        res.send(error)
    }
}

//hashing
employeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        // const passwordHash=await bycrypt.hash(password,10)
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        this.comfirmpassword = await bcrypt.hash(this.confirmpassword, 10)
    }
    next()
})

//now we need to create collections

const Register = new mongoose.model("usermanagements", employeSchema)


module.exports = Register