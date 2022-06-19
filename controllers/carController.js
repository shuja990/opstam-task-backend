import asyncHandler from "express-async-handler";
import Joi from "joi";
import Car from "../models/carModel.js";

// @desc    Add a car
// @route   POST /api/cars/
// @access  Public
const createCar = asyncHandler(async (req, res) => {
  const { name, model, make, regNo, category, addedBy, image } = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    model: Joi.string().alphanum().required(),
    make: Joi.string().required(),
    regNo: Joi.string().alphanum().required(),
    category: Joi.string().required(),
    addedBy: Joi.string().required(),
    image: Joi.string().required(),
  });
  const value = await schema.validateAsync({
    name: name,
    model: model,
    make: make,
    regNo: regNo,
    category: category,
    addedBy: addedBy,
    image: image,
  });

  const car = new Car({
    name,
    model,
    make,
    regNo,
    category,
    addedBy,
    image,
  });

  const createdCar = await car.save();
  res.status(201).json(createdCar);
});

// @desc    Fetch all Cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Car.countDocuments({ ...keyword });
  const cars = await Car.find({ ...keyword })
    .populate({ path: "addedBy", select: "_id name" })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ cars, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate({
    path: "addedBy",
    select: "_id name",
  });

  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/User
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (req.user._id.toString() !== car.addedBy.toString()) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  if (car) {
    await car.remove();
    res.json({ message: "Car removed" });
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/User
const updateCar = asyncHandler(async (req, res) => {
  const { name, model, make, category, image } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    model: Joi.string().alphanum(),
    make: Joi.string(),
    category: Joi.string(),
    image: Joi.string(),
  });
  const value = await schema.validateAsync({
    name: name,
    model: model,
    make: make,
    category: category,
    image: image,
  });
  const car = await Car.findById(req.params.id);
  if (req.user._id.toString() != car.addedBy.toString()) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  if (car) {
    car.name = name || car.name;
    car.model = model || car.model;
    car.make = make || car.make;
    car.category = category || car.category;
    car.regNo = car.regNo;
    car.addedBy = car.addedBy;
    car.image = image || car.image;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

export { createCar, getCars, getCarById, deleteCar, updateCar };
