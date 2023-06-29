const express = require("express");
const router = express.Router();
const sensorSchema = require("../models/sensor");
const historySensorSchema = require("../models/historySensor");

// get all sensors
router.get("/sensor", (req, res) => {
  sensorSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
router.get("/sensor/:id", (req, res) => {
  let { id } = req.params;

  sensorSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// post sensor
router.post("/sensor", (req, res) => {
  const createdAt = new Date().toLocaleString();
  const sensor = req.body;
  sensor.createdAt = createdAt;
  sensor.updatedAt = createdAt;

  sensorSchema(sensor)
    .save()
    .then((data) => {
      historySensorSchema({
        idSensor: data._id,
        name: data.name,
        timeStamp: createdAt,
        temperatura: data.temperatura,
        humedad: data.humedad,
        co2: data.co2,
      }).save();
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});
// put sensor
router.put("/sensor/:id", (req, res) => {
  let { id } = req.params;
  const { name, coords, co2, humedad, temperatura } = sensorSchema(req.body);
  const updatedAt = new Date().toLocaleString();

  historySensorSchema({
    idSensor: id,
    name,
    timeStamp: updatedAt,
    temperatura,
    humedad,
    co2,
  }).save();

  if (coords.length != 0) {
    sensorSchema
      .updateOne(
        { _id: id },
        { $set: { name, coords, updatedAt, co2, humedad, temperatura } }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  } else {
    sensorSchema
      .updateOne({ _id: id }, { $set: { humedad, temperatura } })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  }
});

// remove sensor
router.delete("/sensor/:id", (req, res) => {
  let { id } = req.params;

  historySensorSchema.deleteMany({'idSensor':id})

  sensorSchema
    .findOneAndDelete({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
