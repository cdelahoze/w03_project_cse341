const express = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
//const createError = require('http-errors') //6.4K (gzipped: 2.6K)
const { expensesSchema } = require("../helpers/validation_schema"); //Validation

const getAllExpenses = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("expenses").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const getSingleExpenses = async (req, res, next) => {
  try {
    const expenseId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("expenses")
      .find({ _id: expenseId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Validation
    next(error);
  }
};

const createExpenses = async (req, res, next) => {
  try {
    const expense = {
      description: req.body.description,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      receipt: req.body.receipt,
      category: req.body.category,
      nextPaymentDate: req.body.nextPaymentDate,
      idUsers: req.body.idUsers,
    };
    const result = await expensesSchema.validateAsync(req.body); // Validation
    console.log(result);
    const response = await mongodb
      .getDb()
      .db()
      .collection("expenses")
      .insertOne(expense);
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

const updateExpenses = async (req, res) => {
  try {
    const expenseId = new ObjectId(req.params.id);
    // be aware of updateOne if you only want to update specific fields
    const expense = {
      description: req.body.description,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      receipt: req.body.receipt,
      category: req.body.category,
      nextPaymentDate: req.body.nextPaymentDate,
      idUsers: req.body.idUsers,
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection("expenses")
      .replaceOne({ _id: expenseId }, expense);
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

const deleteExpenses = async (req, res, next) => {
  try {
    const expenseId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("expenses")
      .deleteOne({ _id: expenseId }, true);
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
  getAllExpenses,
  getSingleExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
