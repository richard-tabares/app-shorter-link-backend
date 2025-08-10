import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()

// Habilitar JSON y CORS
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

function idGeneraror() {
    
    const idLink = Math.random().toString(36).substring(2, 8)

    return idLink

}

app.post('/idLink', (req, res) => {

    const { inputUrl } = req.body
    const idLink = idGeneraror()

    const shortLink = {
        idLink: idLink,
        url: inputUrl,
        shortLink: `http://localhost:${PORT}/${idLink}`
    };

    res.send(shortLink)

})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})