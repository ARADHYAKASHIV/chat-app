import dotenv from 'dotenv';

dotenv.config();

console.log("MongoDB URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
