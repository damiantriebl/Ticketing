import express from 'express'

const router = express.Router()

router.get('/api/users/currentuser',(req, res)=>{
    res.send('this is currentUser LOCAL')
})

export { router as currentUserRouter}