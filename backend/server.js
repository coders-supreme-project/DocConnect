const express = require("express");
// const { sequelize } = require("./models");
const cors = require("cors")
const App = express();
App.use(express.json())
App.use(express.urlencoded({ extended: true }));
App.use(cors());
const bodyParser = require("body-parser");
const doctorRoute = require('./routes/doctorRoutes')



const port = process.env.PORT || 5000;

App.use("/api/doctor", doctorRoute);


// App.use('/',);
// App.use("/",);
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
