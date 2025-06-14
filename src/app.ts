import express from 'express'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import { notFound } from './middlewares/notFound'

// routes
import userRoutes from './routes/user.routes'
import propertyRoutes from './routes/property.route'


const app = express()

app.use(express.json())

// ----------User routes -------------
app.use('/api/v1/user', userRoutes)

// ----------property routes -------------
app.use("/api/v1", propertyRoutes)

app.use(notFound as never)
app.use(globalErrorHandler)

export default app
