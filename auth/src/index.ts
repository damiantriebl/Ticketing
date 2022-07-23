import { app } from './app';
import mongoose   from 'mongoose';


const start = async () =>{
  console.log('starting up... dev  version 2');
  if(!process.env.JWT_KEY){
    throw new Error('you need to specify the jwt secret')
  }
  if(!process.env.MONGO_URI){
    throw new Error('you need to specify the jwt secret')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to mongoDB')
  } catch (error) {
    console.log(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
}

start()

