import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { supabase } from './services/supabaseClient.js'

//habilita variables de entorno
dotenv.config()
const app = express()

// Habilitar JSON y CORS
app.use(cors())
app.use(express.json())

//variable de entorno PORT
const PORT = process.env.PORT
// const BASE_URL = process.env.BASE_URL

//funcion para crear manualmente el idLink
const idGeneraror = () => Math.random().toString(36).substring(2, 8)

//endopoint para crear el id del link y devolver un objeto con la informacion completa
app.post('/createIdLink', async (req, res) => {
	//se recibe la url del body para acortarla
	const { inputUrl } = req.body
	let idLink = ''
	//varibale utilizada para validar que se cree un idLink unico
	//en la base de datos
	let exits = true

	//se obtiene protocolo y host para URL base
	const baseUrl = `${req.protocol}://${req.get('host')}`
	// const baseUrl = `${req.protocol}://${BASE_URL}`

	try {
		//antes de guardar debo verificar si ya existe un idLink
		while (exits) {
			idLink = idGeneraror()

			//consult a la DB si existe el idLink generado
			const { data: existingLink, error: existingError } = await supabase
				.from('links')
				.select()
				.eq('idLink', idLink)
				.maybeSingle()

			//lanzamos error si hay algun problema con la coneccion a la DB
			if (existingError)
				throw new Error('Error al conectarse con el servicio')

			//validamos que si la consulta haya devuelto informacion
			//en caso de devolver, pondra un false
			//en caso de no devolver nada, podra true y seguira el while
			// hasta encontrar un idLink unico
			exits = !!existingLink
		}

		//se crea objeto para unir ambas partes, url base e idLink
		const shortLink = {
			idLink,
			url: inputUrl,
			shortLink: `${baseUrl}/${idLink}`,
		}

		//guardar en supabasee
		const { error } = await supabase.from('links').insert([shortLink])

		//lanzamos error si hay algun problema con la coneccion a la DB
		if (error) throw new Error('Error al conectarse con el servicio')

		//enviamos objeto json al frontend con la informacion
		res.send(shortLink)
	} catch (error) {
		//retornamos el error de ser asi
		return res.status(500).json({ error: error.message })
	}
})

//api para consultar el idLink y redireccion a la url original
app.get('/:idLink', async (req, res) => {
	//adicionar try para asegurarnos la consulta
	const idLink = req.params.idLink

	try {
		const { data, error } = await supabase
			.from('links')
			.select()
			.eq('idLink', idLink)
			.single()

		if (error) throw new Error('Error al conectarse con el servicio')
		return res.redirect(data.url)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

app.post('/login', async (req, res) => {
	//extraemos usuario y contraseña del body
	const { user, pass } = req.body
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: user,
			password: pass,
		})
		//lanzamos error si hay algun problema con la coneccion a la DB
		if (error) throw new Error(error)
		//enviamos objeto json al frontend con la informacion
		res.send(data)
	} catch (error) {
		//retornamos el error de ser asi
		return res.status(500).json({ error: error.message })
	}
})
app.post('/singup', async (req, res) => {
	//extraemos usuario y contraseña del body
	const { user, pass } = req.body

	try {
		const { data, error } = await supabase.auth.signUp({
			email: user,
			password: pass,
		})
		//lanzamos error si hay algun problema con la coneccion a la DB
		if (error) throw new Error(error)
		//enviamos objeto json al frontend con la informacion
		console.log(error)
		res.send(data)
	} catch (error) {
		//retornamos el error de ser asi
		return res.status(500).json({ error: error.message })
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
