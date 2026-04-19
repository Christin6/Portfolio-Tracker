const express = require('express')
const app = express()
const middleware = require('./utils/middleware')

const YahooFinance = require('yahoo-finance2').default
const yahooFinance = new YahooFinance()

app.use(middleware.requestLogger)

app.get('/api/stock/:ticker', async (request, response) => {
  const quote = await yahooFinance.quote(request.params.ticker)
  response.json(quote)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})