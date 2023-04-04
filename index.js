const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const cors = require('cors');

const app = express();

// CORS
const corsOptions = {
    origin: 'https://casinosimulator.netlify.app/'
};

app.use(cors(corsOptions));

// MONGOOSE CONNECTION
db.mongoose
    .connect(db.url, db.mongoOptions)
    .then(() => {
        // Success
        console.log("Successfully connected to Mongo Database.");
        connect();
    })
    .catch((err) => {
        console.error("Something went wrong.", err);
        process.exit();
    });

// MIDDLEWARE
// Parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const port = process.env.PORT || 8070;

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
}

// ROUTES
app.get('/wheels/latest', async (req, res) => {
    try {
      const lastWheel = await db.wheel.findOne().sort({ nonce: -1 }).exec();
      console.log("SENDING");
      res.send(lastWheel);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

app.get('/wheels', async (req, res) => {
    const results = await db.wheel.find().sort({ nonce: -1 }).limit(100);
    res.json(results);
});

module.exports = app;