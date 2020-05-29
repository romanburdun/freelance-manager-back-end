const mongoose = require('mongoose')
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;
