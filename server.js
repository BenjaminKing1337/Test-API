//import dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// swagger deps
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
// setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
//import tool routes
const toolRoutes = require("./routes/tools");
//import user routes
const authRoutes = require("./routes/auth");
// ---
require("dotenv-flow").config();
app.use(express.json());

// Handle CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// DB connection
mongoose.connect
    (
        process.env.DBHOST,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    ).catch(error=>console.log("Error connecting to MongoDB:" + error));
mongoose.connection.once('open', () => console.log("Successfully connected to MongoDB" ));
// routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Welcome to the Art of Assassination" });
})
//post, put, delete -> CRUD
app.use("/api/tools", toolRoutes);
// user, register and login
app.use("/api/contractors", authRoutes);
// port
const PORT = process.env.PORT || 4000;
// start up server
app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
})
// module exports
module.exports = app;