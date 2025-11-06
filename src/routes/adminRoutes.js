import express from 'express';

const route = express.Router()

route.get('/dashboard' , (req ,res)=>{
    res.send('admin dashboard')
})


export default route;