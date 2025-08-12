import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()

// Habilitar JSON y CORS
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT
// const baseUrl = process.env.BASE_URL

//funcion para crear manualmente el idLink
function idGeneraror() {

    const idLink = Math.random().toString(36).substring(2, 8)

    return idLink

}

//api para crear el id del link y devolver la informacion completa
app.post('/createIdLink', (req, res) => {

    //se recibe la url para acortarla
    const { inputUrl } = req.body
    console.log(inputUrl)
    const idLink = idGeneraror()

    const baseUrl = (`${req.protocol}://${req.get("host")}`)
    
    const shortLink = {
        idLink: idLink,
        url: inputUrl,
        shortLink: `${baseUrl}/${idLink}`
    };
    console.log("Body recibido:", req.body);
    //guardar en supabasee
    res.send(shortLink)
    
})

//api para consultar el idLink y redireccion a la url original
app.get('/idLink/:idLink', (req, res) => {

    const idLink = req.params.idLink
        
    res.send(idLink)

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})