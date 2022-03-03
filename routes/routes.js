const router = require("express").Router();
const scrape = require("../scrape");
const crypto = require("crypto");
const path = require("path");
const database = require("monk").default(process.env.MONGO_URI);

//GET test
router.get("/get", (req, res) => {
  res.send("Get test");
});

//POST test
router.post("/post", (req, res) => {
  res.send("POST test");
});

//GET image
router.get("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const screenshots = database.get("screenshot");
    const screenshot = await screenshots.find({
      "session-id": id,
    });
    return res.json(screenshot[0]);
  } catch (error) {
    return res.status(404).send();
  }
});

module.exports = router;
