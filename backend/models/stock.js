const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const stockSchema = new mongoose.Schema({
    name: String,
    ticker: String,
    avgBuyPrice: Number,
    quantity: Number,
    currency: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

stockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Stock', stockSchema)
