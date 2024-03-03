const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
mongoose.connect(
  `mongodb+srv://${user}:${password}@cluster0.m2qm6aq.mongodb.net/registrationFormDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const registerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
// mode of registration schema
const Register = mongoose.model("Register", registerSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});
app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // Check if user with the same email already exists (case insensitive)
      const existingUser = await Register.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } });
      if (existingUser) {
        console.log("User already exists");
        return res.redirect("/error");
      } else {
        const registerData = new Register({
          name,
          email,
          password,
        });
        await registerData.save();
        return res.redirect("/success");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      return res.status(500).send("Internal server error");
    }
  });
  
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
  // console.log(`Server is running on port ${port}`)
});
