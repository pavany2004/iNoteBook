const connectToMongo = require("./db");
const express = require("express");
var cors=require('cors')
connectToMongo();





const app = express();
const port = 5000;

app.use(cors(
  {
    origin:["https://i-note-book-frontend-nu.vercel.app/login"]
  }
))

app.use(express.json());
// available routes

app.use("/api/auth", require("./routes/auth"));

app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello Everyone");
});

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`);
});
