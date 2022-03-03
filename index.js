// Server imports =========
require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
// const morgan = require("morgan"); // Development
const database = require("monk").default(process.env.MONGO_URI);
const scrape = require("./scrape");
const router = require("./routes/routes");

// ========================

const path = require("path");
const { resolve } = require("path");

// App
const app = express();
const server = app.listen(process.env.PORT || 4000, () => {
  console.log("Listening to port", process.env.PORT || 4000);
});

app.use(express.static("public"));
// app.use(morgan("dev")); Development

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket setup
const io = socket(server);

// Router middleware
app.use("/api", router);

// IO connection
io.on("connection", (socket) => {
  let page;
  console.log("New socket opened: " + socket.id);

  socket.on("scrape", async (data, fn) => {
    console.log("scrape socket event:", data);
    script = await scrape.Scrape(socket.id);
    page = script.page;
    _log = script.logArr;
    fn({
      status: true,
      instance: socket.id,
      log: _log,
    });
  });

  socket.on("login", (data) => {
    scrape
      .login(page, data)
      .then((username) => {
        socket.emit("loggedOn", username);
      })
      .catch((err) => {
        socket.emit("errorLoggingIn", "err");
        console.log("socket event error");
        console.log(err);
      });
  });

  socket.on("disconnect", async () => {
    // TODO: call monk to delete screenshot entry if any
    try {
      const screenshots = database.get("screenshot");
      await screenshots.remove({
        "session-id": socket.id,
      });
      console.log(socket.id);
      console.log("disconnected");
      return resolve();
    } catch (error) {
      return reject("error removing screenshot from mongodb: ", error);
    }
  });
});
