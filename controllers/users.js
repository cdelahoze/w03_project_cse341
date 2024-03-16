const express = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
//const createError = require('http-errors') //6.4K (gzipped: 2.6K)
const { authSchema } = require("../helpers/validation_schema"); //Validation

const getAllUsers = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("users").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const getSingleUsers = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("users")
      .find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const createUsers = async (req, res, next) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      repeatPassword: req.body.repeatPassword,
      userName: req.body.userName,
    };
    const result = await authSchema.validateAsync(req.body); // Validation
    console.log(result);
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while creating the contact."
        );
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const updateUsers = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    // be aware of updateOne if you only want to update specific fields
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      repeatPassword: req.body.repeatPassword,
      userName: req.body.userName,
    };
    const result = await authSchema.validateAsync(req.body); // Validation
    console.log(result);
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .replaceOne({ _id: userId }, contact);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while updating the contact."
        );
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const deleteUsers = async (req, res, next) => {
  try { 
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .deleteOne({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while deleting the contact."
        );
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getSingleUsers,
  createUsers,
  updateUsers,
  deleteUsers,
};
