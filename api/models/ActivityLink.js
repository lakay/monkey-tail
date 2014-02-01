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
        sourceIds: {
            type: 'array',
            defaultsTo: []
        },
        targetIds: {
            type: 'array',
            defaultsTo: []
        },
        location: 'string',
        startDateTime: 'datetime',
        success: 'boolean',

        pointsForSource: {
            type: 'array',
            defaultsTo: []
        },
        pointsForTarget: {
            type: 'array',
            defaultsTo: []
        },

        referenceCode: {
            type: 'string',
            required: true
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

        // TODO: Validate sources and targets
        // TODO: Validate that lengths of points arrays correspond to sources and targets
        next();
    }
};
