require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const Customer = require("./database/models/customer")
const auth = require('./database/middleware/auth')

require('./database/connection')
const port = process.env.PORT || 8080;
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.set('view engine', 'ejs')

app.get('/', (req, res) => { 
    res.render('index',{
        d : 'none',
        path: '/'
    })
})

app.get('/secret',auth, (req, res) => { 
    res.render('secret')
})
app.get('/logout',auth,async(req,res)=>{
   try {
    res.clearCookie('jwt')
    req.user.tokens =await req.user.tokens.filter((currentElem)=>{
        return currentElem.token !== req.token
    })
    res.redirect('/login')
    req.user.save()
   } catch (error) {
    res.status(500).send(err)
   }
    
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
            res.cookie('jwt',token,{
                expires:new Date(Date.now()+200000),
                httpOnly:true
            })    

            if (compairSuccess) {
                res.redirect('/secret')
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
            res.cookie('jwt',token,{
                expires:new Date(Date.now()+200000),
                httpOnly:true
            })
            
            await newCustomer.save()

            res.redirect('/secret')
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