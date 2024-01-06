const jwt = require('jsonwebtoken')
const Customer = require('../models/customer')

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
        const userData = await Customer.findOne({_id:verifyUser._id})
        req.token = token;
        req.user = userData;
        // console.log(userData)
    } catch (error) {
        res.status(401).send(error)
    }
    next()
}
module.exports =auth