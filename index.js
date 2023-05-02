const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const DB = require("./config/db");
const { connectWhatsApp } = require("./controllers/whatsapp");

const app = express();

const PORT = process.env.PORT || 5000;

const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req, res) => {
  res.json("Server Running Successfully");
});

app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/whatsapp"));
app.use("/api", require("./routes/bots"));
app.use("/api", require("./routes/SalesManger"));

DB();

connectWhatsApp(io);

http.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
