import { app } from './app';
import mongoose   from 'mongoose';


const start = async () =>{
  if(process.env.jwt){
    throw new Error('you need to specify the jwt secret')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('connected to mongoDB')
  } catch (error) {
    console.log(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
}

start()

