
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb://divyach2006_db_user:divyaji@ac-67wdlg6-shard-00-00.ack3vvl.mongodb.net:27017,ac-67wdlg6-shard-00-01.ack3vvl.mongodb.net:27017,ac-67wdlg6-shard-00-02.ack3vvl.mongodb.net:27017/hospitalDB?ssl=true&replicaSet=atlas-6ijk6j-shard-0&authSource=admin&appName=Cluster0"
    );

    console.log(" MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
}

connectDB();

// Schema
const patientSchema = new mongoose.Schema({
  patientName: String,
  admissionDate: String,
  illness: String,
});

// Model
const Patient = mongoose.model("Patient", patientSchema);

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "patient.index.html"));
});

// Save Patient
app.post("/register", async (req, res) => {
  try {
    const patient = new Patient({
      patientName: req.body.patientName,
      admissionDate: req.body.admissionDate,
      illness: req.body.illness,
    });

    await patient.save();

    res.send(
      `<h2>${req.body.patientName} has been saved successfully in MongoDB.</h2><br><a href="/">Go Back</a>`
    );
  } catch (err) {
    console.log(err);
    res.send("Error saving patient.");
  }
});

// Fetch Patients
app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();

    let output = "<h2>Registered Patients</h2>";

    patients.forEach((patient, index) => {
      output += `
      <p>
      <strong>${index + 1}.</strong><br>
      Name: ${patient.patientName}<br>
      Date of Admission: ${patient.admissionDate}<br>
      Illness: ${patient.illness}
      </p>
      <hr>
      `;
    });

    res.send(output);
  } catch (err) {
    console.log(err);
    res.send("Error fetching patients.");
  }
});

// Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});