require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler')
const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')

// stock middlewares
app.use([express.json(), express.urlencoded()]);

// routes
app.use('/api/v1/user', authRouter)
app.use('/api/v1/posts', postsRouter)
// app.use('/api/v1/posts/:postId/coments', comentsRouter)

// error handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3500;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI).then(() => console.log('Succesfully connected to db... '))
        app.listen(port, () => console.log(`Server is listening on port ${port}... `))
    } catch (error) {
        console.log(error);
    }
}

start()