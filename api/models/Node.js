/**
 * Node
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

'use strict';

module.exports = {

    attributes: {

        createdAt: {
            type: 'datetime',
            required: true
        },

        updatedAt: {
            type: 'datetime',
            required: true
        },

        ownerId: {
            type: 'integer',
            required: true
        },
        targetId: {
            type: 'integer',
            required: true
        },

        coordX: {
            type: 'float',
            min: 0.0,
            max: 1.0
        },

        coordY: {
            type: 'float',
            min: 0.0,
            max: 1.0
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