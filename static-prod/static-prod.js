const express = require('express')
const path = require('path')
const app = express()
  
// Static Middleware
app.use(express.static(path.join('../frontend/dist/frontend/')))

  
app.listen(8080, function(error){
    if(error) throw error
    console.log("Server created Successfully")
})