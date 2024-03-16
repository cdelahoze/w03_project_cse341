const Joi = require('@hapi/joi') //141.2K (gzipped: 41.4K)

const authSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(15),
    lastName: Joi.string().required(),
    email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required(), 
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeatPassword: Joi.ref('password'),
    userName: Joi.string().required().alphanum().min(3).max(30),
    })

const expensesSchema = Joi.object({

    description: Joi.string().required().min(2).max(50),
    amount: Joi.number().required().integer().min(1000).max(10000000),
    paymentDate: Joi.date().required(),
    receipt: Joi.string().required().min(2).max(50),
    category: Joi.string().required().min(2).max(50),
    nextPaymentDate: Joi.date().required(),
    idUsers: Joi.string().required().min(2).max(50),

    
    })
    
    module.exports = { 
        authSchema,
        expensesSchema
    }

