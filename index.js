import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/ping', (req, res) => {
  res.json({ pong: true })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`)
})