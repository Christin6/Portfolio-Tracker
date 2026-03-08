import { useState, useEffect } from 'react'
import stockService from './services/stock'

function App() {
  const [bbriPrice, setBbriPrice] = useState(null)
  const [msftPrice, setMsftPrice] = useState(null)

  useEffect(() => {
    stockService.getStockPrice('BBRI.JK').then(price => setBbriPrice(price))
    stockService.getStockPrice('MSFT').then(price => setMsftPrice(price))
  }, [])

  return (
    <>
      <div>
        <p>BBRI: Rp.{bbriPrice ?? 'Loading...'}</p>
        <p>MSFT: ${msftPrice ?? 'Loading...'}</p>
      </div>
    </>
  )
}

export default App
