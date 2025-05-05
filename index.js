import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mynewdatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
  if (!updatedData) {
    return res.status(404).json({ error: "item not found" })
  }
  res.json(updatedUser);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});