const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || 
                  process.env.DB_URL || 
                  'mongodb+srv://raulvaldes_db_user:iUTpjQ7SP2iFqWN8@cluster0.idoaooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

