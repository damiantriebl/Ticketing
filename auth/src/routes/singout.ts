import express from 'express'

const router = express.Router()

router.post('/api/users/singout',(req, res)=>{
    res.send('this is singout')
})

export { router as singoutRouter}