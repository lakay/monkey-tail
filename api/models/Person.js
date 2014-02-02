/**
 * Person
 *
 * @module      :: Model
 * @description :: A Person in the game. This is user account, real-life person, ...
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

'use strict';

var scrypt = require('js-scrypt');

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function generateAlienName() {
    return 'Zorg-' + ((1000000 * Math.random()).toFixed(0));
}

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

        // Personal info and contact data
        email: {
            type: 'email',
            unique: true
        },
        password: {
            type: 'string'
        },
        salt: {
            type: 'string',
            required: true
        },
        alienName: {
            type: 'string',
            required: true,
            unique: true
        },

        firstName: { type: 'string' },
        lastName: { type: 'string' },
        dateOfBirth: {
            type: 'string',
            regex: /^\d{4}(?:-\d\d){0,2}$/
        },
        phone: { type: 'string' },
        address: { type: 'string' },
        gender: {
            type: 'string',
            in: ['male', 'female', 'other']
        },
        locale: {
            type: 'string',
            len: 2,
            defaultsTo: 'en',
            required: true
        }
    },

    beforeValidation: function(values, next) {
        if (isBlank(values.alienName)) {
            values.alienName = generateAlienName();
        }
        if (!values.createdAt) {
            values.createdAt = new Date().toISOString();
        }
        if (!values.salt) {
            values.salt = (Math.random()).toFixed(8);
        }
        values.updatedAt = new Date().toISOString();
        next();
    },

    // TODO: move that into the controller
    beforeCreate: function(values, next) {
        if (values.password) {
            scrypt.hash(values.password, values.salt, function (err, hashed) {
                if (err) {
                    return next(err);
                }
                values.password = hashed;
                next();
            });
        } else {
            next();
        }
    }
};
