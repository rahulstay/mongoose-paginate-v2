const express = require("express");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/newco")
  .then(() => console.log("Database connected"))
  .catch(console.error);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, min: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true }
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema, "newcoda");

/* ---------------- PAGINATION ROUTE ---------------- */
app.get("/users", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await User.paginate({}, { page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- NORMAL ROUTES ---------------- */
app.get("/", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

app.get("/delete/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser);
});

app.get("/shows/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
