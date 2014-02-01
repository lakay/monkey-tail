/**
 * Activity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        // id (added automatically by Waterline)

        createdAt: {
            type: 'datetime',
            required: true
        },

        updatedAt: {
            type: 'datetime',
            required: true
        },

        name: {
            type: 'string',
            required: true
        },

        // in milliseconds
        timeLimit: {
            type: 'integer',
            required: true,
            defaultsTo: 24 * 60 * 60 * 1000
        },

        className: {
            type: 'string',
            in: ['Self', 'Shopping', 'Restaurant'],
            required: true
        },

        givesVegBites: {
            type: 'boolean',
            required: true
        }
    },

    beforeValidation: function(values, next) {
        if (!values.createdAt) {
            values.createdAt = new Date().toISOString();
        }
        values.updatedAt = new Date().toISOString();
        next();
    }
};
