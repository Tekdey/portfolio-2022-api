const axios = require("axios");
const express = require("express");
const app = express();
const { sendMail } = require("./nodemailer");
const Manager = require("./manager");
require("dotenv").config();

const PORT = process.env.PORT ?? 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  try {
    let result;
    const manager = new Manager(req.body);
    try {
      result = await manager.check();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }

    if (result) {
      sendMail(result);
      await axios.get(process.env.PHONE_URL);
    }

    res.status(200).json({
      success:
        "Votre message à été envoyé, vous allez recevoir une réponse sous 24h.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur interne, réessayer plus tard." });
  }
});

app.listen(PORT, () => console.log("serveur running port: ", PORT));
