import express from 'express'
import userRoutes from './routes/user.routes'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import { notFound } from './middlewares/notFound'
const app = express()

app.use(express.json())

// ----------User routes -------------
app.use('/api/v1/user', userRoutes)

app.use(notFound as never)
app.use(globalErrorHandler)

export default app
