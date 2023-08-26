const express = require('express');
const mongoose = require('mongoose');

const loginRoutes = require('./routes/login');
const usersRoutes = require('./routes/users');
const flightsRoutes = require('./routes/flights');

require('dotenv').config();
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
});
database.once('connected', () => {
    console.log('Database Connected');
});

const app = express();
app.use(express.json());
app.use('/api/login', loginRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/flights', flightsRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/about", (req, res) => {
    res.send("About route");
});

app.listen(3001,() => console.log("Server listening at port 3001"));
