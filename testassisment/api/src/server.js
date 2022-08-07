/** @format */
import 'regenerator-runtime/runtime';
import http from 'http';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import router from './routes';
import { connect } from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
dotenv.config();

const app = express();

const url = process.env.DB_URI;
console.log(`Trying to connect with: ${url}`);
connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected successfully.');
    // seedIntitialData();
  })
  .catch((err) => {
    console.log('Error in database connection', err.message);
  });

// Created Swagger Doc
app.use(morgan('dev'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ limit: '100mb' }));

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'authorization'],
};
app.use(cors(corsOption));
//Image Path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/', router);

// Route for home page
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin panel build
app.use('**', (_, res) => {
  return res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// create server
const server = http.createServer(app);

const port = process.env.PORT || 8000;
server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
