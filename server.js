'use strict';

const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const jsonParser = bodyParser.json();
const app = express();

const blogRouter = require('./blogRouter');


app.use(morgan('common'));

app.use('/blog-posts', blogRouter);


app.listen(process.env.PORT || 8080, () => console.log(
    `Listening on port ${process.env.PORT || 8080}`));