const express = require('express')
const dotenv = require('dotenv')
const ems = require('express-mongo-sanitize')
const helmet = require('helmet');

const hpp = require('hpp');
const erl = require('express-rate-limit');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
//Routes
const projects = require('./routers/project.router')
const tasks = require('./routers/tasks.router');
const incomePlatforms = require('./routers/incomePlatform.router')
const expenses = require('./routers/expense.router')
const auth = require('./routers/auth.router')
const sessions = require('./routers/session.router');
const clients = require('./routers/client.router');
const finance = require('./routers/finance.router');
const invoices = require('./routers/invoice.router');
//error handling middleware
const errorHandler = require('./middleware/errorHandler')

// Swagger documentation
const swaggerjsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

const DisableTryItOutPlugin = function() {
    return {
        statePlugins: {
            spec: {
                wrapSelectors: {
                    allowTryItOutFor: () => () => false
                }
            }
        }
    }
}


const swaggerOptions = {
    plugins: [
        DisableTryItOutPlugin
    ],
    swaggerDefinition: {

        info: {
            title: 'Freelance manager API',
            description: ' Freelance manager API access points',
            contact: {
                name: 'Roman Burdun'
            },

            server: [`${process.env.NODE_ENV}:8081`],
            securityDefinitions: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    scheme: 'bearer',
                    in: 'header',
                },
            },
        },

    },

    apis: ['./routers/*.router.js'],


}

const options = {
  swaggerOptions: {
      plugins: [
           DisableTryItOutPlugin
      ]
   }
};



const swaggerDocs = swaggerjsDoc(swaggerOptions)

dotenv.config({path: './config/prod.env'})
connectDB()

const app = express();

// App.use middleware
app.use(express.json())
// File upload middleware
app.use(fileUpload())

//app.use(express.static(path.join(__dirname, './public')))

app.use(cookieParser())
//Security middleware
//Express-Mongo-Sanitize
app.use(ems());
//Helmet
app.use(helmet());

//Express-Rate-Limit
const limit = erl({
    windowMs: 1*60 * 1000, // 1 min
    max: 100
})
app.use(limit);

//HPP
app.use(hpp());

//CORS
let corsConfig = {}

if(process.env.NODE_ENV == 'production') {
    corsConfig = {
        origin: process.env.HOST,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    }
}

app.use(cors(corsConfig))





if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

//Routes declaration
app.use('/api/v1/projects', projects)
app.use('/api/v1/tasks', tasks)
app.use('/api/v1/ips', incomePlatforms)
app.use('/api/v1/expenses', expenses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/sessions', sessions)
app.use('/api/v1/clients', clients)
app.use('/api/v1/finance', finance)
app.use('/api/v1/invoices', invoices)
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options))
app.use(errorHandler)



module.exports = app
