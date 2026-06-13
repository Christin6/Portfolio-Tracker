require("dotenv").config();

const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    },
    stocks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
        },
    ],
});

const User = mongoose.model('User', userSchema)

/*
const stockSchema = new mongoose.Schema({
    name: String,
    ticker: String,
    avgBuyPrice: Number,
    quantity: Number,
    currency: String,
})

const Stock = mongoose.model('Stock', stockSchema)

const stock = new Stock({
    name: "Apple Inc.",
    ticker: "AAPL",
    avgBuyPrice: 150.00,
    quantity: 10,
    currency: "USD",
})

stock.save().then(result => {
    console.log('stock saved!')
    mongoose.connection.close()
})

Stock.find({}).then(result => {
    result.forEach(stock => {
        console.log(`${stock.name} (${stock.ticker}): ${stock.quantity} shares, avg buy price ${stock.avgBuyPrice} ${stock.currency}`)
    })
    mongoose.connection.close()
})
    */