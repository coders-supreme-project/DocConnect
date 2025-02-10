const express = require('express');
const Router = express.Router();
const {createMeeting} = require('../controller/vedio.controller');

// Define the search endpoint
Router.post('/create-meeting',createMeeting);

module.exports = Router;