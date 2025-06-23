import express from 'express'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import { notFound } from './middlewares/notFound'
import cors from 'cors'
// routes
import userRoutes from './routes/user.routes'
import propertyRoutes from './routes/property.route'
import reviewRoutes from './routes/review.route'
import WishlistRoutes from './routes/wishlist.route'
import newsLetterRoutes from './routes/newsLetter.controller'
import newsRoutes from './routes/news.route'
import contactRoutes from './routes/contact.route'

const app = express()
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
)

app.use(express.json())

// ----------User routes -------------
app.use('/api/v1/user', userRoutes)

// ----------property routes -------------
app.use('/api/v1', propertyRoutes)

// ----------review routes -------------
app.use('/api/v1', reviewRoutes)

// ----------wishlist routes -------------
app.use('/api/v1', WishlistRoutes)

// ----------Newsletter routes -------------
app.use('/api/v1', newsLetterRoutes)

// ----------news routes -------------
app.use('/api/v1', newsRoutes)

// ----------contact routes -------------
app.use('/api/v1', contactRoutes )

app.use(notFound as never)
app.use(globalErrorHandler)

export default app
