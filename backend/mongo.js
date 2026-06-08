const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://fullstack:${password}@ac-gt1vm0e-shard-00-00.hbsy0fh.mongodb.net:27017,ac-gt1vm0e-shard-00-01.hbsy0fh.mongodb.net:27017,ac-gt1vm0e-shard-00-02.hbsy0fh.mongodb.net:27017/PortfolioManagementApp?ssl=true&replicaSet=atlas-6gs4mi-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const stockSchema = new mongoose.Schema({
    name: String,
    ticker: String,
    avgBuyPrice: Number,
    quantity: Number,
    currency: String,
})

const Stock = mongoose.model('Stock', stockSchema)

/* const stock = new Stock({
    name: "Apple Inc.",
    ticker: "AAPL",
    avgBuyPrice: 150.00,
    quantity: 10,
    currency: "USD",
})

stock.save().then(result => {
    console.log('stock saved!')
    mongoose.connection.close()
}) */

Stock.find({}).then(result => {
    result.forEach(stock => {
        console.log(`${stock.name} (${stock.ticker}): ${stock.quantity} shares, avg buy price ${stock.avgBuyPrice} ${stock.currency}`)
    })
    mongoose.connection.close()
})