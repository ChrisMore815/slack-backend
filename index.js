const express = require('express');
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", () => {
  return console.log("Hello, I'm Express");
})

app.listen(PORT, () => {
  console.log(`Server is runnig on PORT ${PORT}`);
})