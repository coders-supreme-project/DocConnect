const express = require("express");
// const { sequelize } = require("./models");
const cors = require("cors")
const doctorRoutes = require("./Routes/doctor.routes");
const App = express();

const db=require("../backend/models/index")
const authRoutes = require('./Routes/user.routes')
const appointment=require("./Routes/appointment.routes")
const availabilities=require("./Routes/availibility.routes")
const vedio=require("./Routes/vedio.routes")

const axios = require('axios');
const nodemailer = require('nodemailer');
// const appointment=require("./Routes")

const port = process.env.PORT || 5000;
App.use(cors());
App.use(express.json())
App.use(express.urlencoded({ extended: true }));

App.use("/api/users", authRoutes);

App.use('/api/doctor', doctorRoutes);
App.use('/api/appointment',appointment);
App.use("/api/availability",availabilities);
App.use('/api/vedio', vedio);

// App.use("/", );
// App.use("/", );
// App.use("/", );
// App.use("/" )

// App.use("/", );
// // App.use("//patient", userRoutes);


// // App.use("//patient", testRoutes);
// App.use('/', );
// App.use('/', );

App.listen(port, () => {
  console.log(`app listening on http://127.0.0.1:${port}`);
});
