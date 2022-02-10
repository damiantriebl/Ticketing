import { app } from './app';
import mongoose   from 'mongoose';


const start = async () =>{
  if(!process.env.JWT_KEY){
    throw new Error('you need to specify the jwt secret')
  }
  if(!process.env.MONGOURI){ 
    console.log('MONGOURI', process.env.MONGOURI)
    throw new Error('you need to specify the mongo uri')
  }
  try {
    await mongoose.connect(process.env.MONGOURI!)
    console.log('connected to mongoDB')
  } catch (error) {
    console.log(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000 (ticketing)cd.!!!!!!!!');
  });
}

start()

