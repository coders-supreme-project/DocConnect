const express = require("express");
// const { sequelize } = require("./models");
const cors = require("cors")
const doctorRoutes = require("./Routes/doctor.routes");
const App = express();

const db=require("../backend/models/index")
const authRoutes = require('./Routes/user.routes')

const port = process.env.PORT || 5000;
App.use(cors());
App.use(express.json())
App.use(express.urlencoded({ extended: true }));

App.use("/api/users", authRoutes);

App.use('/api/doctor', doctorRoutes);
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
