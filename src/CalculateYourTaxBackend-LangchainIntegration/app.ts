var  express = require('express');
var app = express();
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');
var {errorHandler} = require('./Middlewares/error');
var dotenv = require('dotenv');
dotenv.config();

const port = process.env["PORT"] || 3000;


const swaggerDocument = require('./swagger.json');
var logger = require('./Middlewares/logging');

// Config
if (process.env["NODE_ENV"] !== "PRODUCTION") {
    logger.info("Development Mode Activated");
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info("Swagger UI is running on /api-docs");
}

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logging Incoming Requests
app.use((req: { method: any; originalUrl: any; body: any; }, res: any, next: () => void) => {
    logger.info(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
  });

// Routes
app.use('/api/calculation', require('./Controllers/CalculationController'));

app.use('/api/formValidation', require('./Controllers/FormValidationController'));

//Endpoints to chatbot
app.use('/api/chatbot', require('./Controllers/ChatBotController'));


app.get('/', (req: any, res: { redirect: (arg0: string) => void; send: (arg0: string) => void; }) => {
  if(process.env["NODE_ENV"] !== "PRODUCTION") {
    res.redirect('/api-docs');
  } else {
    res.send('It works! Please refer to the documentation for more information.');
  }
});


app.listen(port, () => {
  logger.info('Server is running on port ' + port + '...');
});

app.use(errorHandler);

module.exports = app;
