const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- CONNECT DB ----------------
mongoose.connect('mongodb://localhost:27017/stressDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ---------------- SCHEMAS ----------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const DataSchema = new mongoose.Schema({
  userId: String,
  heartRate: Number,
  activityLevel: Number,
  stressLevel: Number,
  abnormal: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const AlertSchema = new mongoose.Schema({
  userId: String,
  message: String,
  type: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Data = mongoose.model('Data', DataSchema);
const Alert = mongoose.model('Alert', AlertSchema);

// ---------------- LOGIC ----------------
function isAbnormal(hr, activity) {
  if (hr > 120 || hr < 50) return true;
  if (activity < 0.2) return true;
  return false;
}

// ---------------- ROUTES ----------------

// Add user
app.post('/api/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Send sensor data
app.post('/api/data', async (req, res) => {
  try {
    const { userId, heartRate, activityLevel, stressLevel } = req.body;

    const abnormal = isAbnormal(heartRate, activityLevel);

    const data = new Data({
      userId,
      heartRate,
      activityLevel,
      stressLevel,
      abnormal
    });

    await data.save();

    // Create alert if abnormal
    if (abnormal) {
      const alert = new Alert({
        userId,
        type: "Silent Stress",
        message: "Abnormal vitals detected"
      });
      await alert.save();
    }

    res.json({ success: true, abnormal });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Get alerts
app.get('/api/alerts/:userId', async (req, res) => {
  const alerts = await Alert.find({ userId: req.params.userId });
  res.json(alerts);
});

// ---------------- START SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
