const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/customerData',{
    family: 4 // Use IPv4, skip trying IPv6
    
}).then(()=>{
    console.log('connection successfull')
}).catch((err)=>{
    console.log(err)
})