require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const Customer = require("./database/models/customer")
require('./database/connection')
const port = process.env.PORT || 8080;
const bcrypt = require('bcryptjs')

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})



app.get('/login', (req, res) => {
    res.render('login',{valError:undefined})
})
app.post('/login', async (req, res) => {
    if (req.body.Email && req.body.password) {
        try {
            const data = await Customer.findOne(
                { email: req.body.Email }
            )
            const compairSuccess =await bcrypt.compare(req.body.password,data.password)

            const token = await data.generateAuth()
            // console.log(token)

            if (compairSuccess) {
                res.render('index')
            }
            else {
                const ip = "incorrect email and password"
                res.render('login',{
                    valError:ip
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
    else {
        const emailVal = "incorrect email and password"
        res.render('login',{
            valError:emailVal
        })
    }
})



app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/signup', async (req, res) => {
 
    if (req.body.password === req.body.confirmPass) {
        try {
            const newCustomer = await new Customer({
                name: req.body.name,
                surename: req.body.sureName,
                email: req.body.Email,
                mobileNo: req.body.mobileNo,
                address: req.body.address,
                password: req.body.password,
                confirmPassword: req.body.confirmPass,
            })
            const token = await newCustomer.generateAuth()
            // console.log(token)
            
            await newCustomer.save()

            res.render('index')
        } catch (err) {
            res.send(err)
        }
    }
    else {
        res.send('your password is not same')
    }
})



app.listen(port, () => {
    console.log(`application listen on port http://localhost:${port}`)
})