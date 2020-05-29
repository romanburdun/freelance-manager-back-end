
const mongoose = require('mongoose');
const Client = require('./client.model')
const IncomePlatformSchema = new mongoose.Schema({
        platformName: {
            type: String,
            required: true
        }

})

IncomePlatformSchema.pre('remove', async function(next){
        let clients = await Client.find({incomePlatform: this._id})
        for(const client of clients) {
            client.remove();
        }
        next();
})

module.exports = mongoose.model('IncomePlatform', IncomePlatformSchema);
