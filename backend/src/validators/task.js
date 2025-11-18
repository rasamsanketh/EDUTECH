const Joi = require('joi');

const createTaskSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  dueDate: Joi.date().optional().allow(null),
  progress: Joi.string().valid('not-started','in-progress','completed').optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  dueDate: Joi.date().optional().allow(null),
  progress: Joi.string().valid('not-started','in-progress','completed').optional()
}).min(1);

module.exports = { createTaskSchema, updateTaskSchema };
