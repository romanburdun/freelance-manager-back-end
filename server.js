const app = require('./app')
const fs = require("fs");
const PORT = process.env.NODE_PORT || 5000;
const {createFolders} = require('./utils/folders');

createFolders();

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT} port`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(() => process.exit(1));
})
