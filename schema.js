const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.schema = Joi.object({
    
            amount: Joi.number().required().min(0),
            type: Joi.string().valid('Income', 'Expense').required(),
            category: Joi.string().optional(),
            notes: Joi.string().optional(),
            user: Joi.objectId().required()
        }).required();
  
module.exports.uSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('Viewer', 'Analyst', 'Admin').required(),
    password: Joi.string()
}).required();