import express from 'express'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import { notFound } from './middlewares/notFound'

// routes
import userRoutes from './routes/user.routes'
import propertyRoutes from './routes/property.route'
import reviewRoutes from './routes/review.route'
import WishlistRoutes from './routes/wishlist.route'

const app = express()

app.use(express.json())

// ----------User routes -------------
app.use('/api/v1/user', userRoutes)

// ----------property routes -------------
app.use("/api/v1", propertyRoutes)

// ----------review routes -------------
app.use('/api/v1', reviewRoutes)

// ----------wishlist routes -------------
app.use('/api/v1', WishlistRoutes)


app.use(notFound as never)
app.use(globalErrorHandler)

export default app
