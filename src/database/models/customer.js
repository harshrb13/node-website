const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const cus_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
        min: 10
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//cookie loken generate
cus_Schema.methods.generateAuth = async function () {
    try {
        // console.log(this._id.toString())
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token
    } catch (error) {
        console.log("this is err", error)
    }
}



//password bcrypt for sign up and login
cus_Schema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10)
    }
    next()
})

const Customer = new mongoose.model('Customer', cus_Schema)

module.exports = Customer