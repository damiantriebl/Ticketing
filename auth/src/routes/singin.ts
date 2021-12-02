import express from 'express'

const router = express.Router()

router.post('/api/users/singin',(req, res)=>{
    res.send('this is singin')
})

export { router as singinRouter}