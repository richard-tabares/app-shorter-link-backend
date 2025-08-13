import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { supabase } from './supabaseClient.js'

dotenv.config()
const app = express()

// Habilitar JSON y CORS
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

//funcion para crear manualmente el idLink

const idGeneraror = () => (Math.random().toString(36).substring(2, 8))

//api para crear el id del link y devolver la informacion completa
app.post('/createIdLink', async (req, res) => {


    //se recibe la url para acortarla
    const { inputUrl } = req.body
    let idLink = ''
    let exits = true

    //get de la url base
    const baseUrl = (`${req.protocol}://${req.get("host")}`)

    try {
        
        //antes de guardar debo verificar si ya existe un idLink
        while (exits) {
            idLink = idGeneraror()
            console.log(idLink)
            const { data: existingLink, error: existingError } = await supabase
            .from('links')
            .select()
            .eq('idLink', idLink)
            .maybeSingle()
            
            if (existingError) throw new Error('Error al conectarse con el servicio')
            
            exits = !!existingLink
            
        }

        //se crea objeto para unir ambas partes, url base e idLink
        const shortLink = {
            idLink,
            url: inputUrl,
            shortLink: `${baseUrl}/${idLink}`
        };

        //guardar en supabasee
        const { data, error } = await supabase
            .from('links')
            .insert([shortLink])

        if (error) throw new Error('Error al conectarse con el servicio')

        res.send(shortLink)

    } catch (error) {

        return res.status(500).json({ error: error.message })

    }

})

//api para consultar el idLink y redireccion a la url original
app.get('/:idLink', async (req, res) => {

    const idLink = req.params.idLink

    const { data, error } = await supabase
        .from('links')
        .select()
        .eq('idLink', idLink)
        .single()

    return res.redirect(data.url)

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})