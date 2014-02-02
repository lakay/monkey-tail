/**
 * ActivityLink
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

'use strict';

function generateReferenceCode() {
    var ALPHABET = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';
    var REFERENCE_CODE_LENGTH = 6;
    var result = '';
    for (var i = 0; i < REFERENCE_CODE_LENGTH; ++i) {
        result = result + ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

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

        activityId: 'integer',
        location: 'string',
        startDateTime: 'datetime',
        success: 'boolean',

        referenceCode: {
            type: 'string',
            required: true,
            unique: true
        }
    },

    beforeValidation: function(values, next) {
        if (!values.createdAt) {
            values.createdAt = new Date().toISOString();
        }
        values.updatedAt = new Date().toISOString();
        if (!values.referenceCode) {
            values.referenceCode = generateReferenceCode();
        }
        next();
    }
};
