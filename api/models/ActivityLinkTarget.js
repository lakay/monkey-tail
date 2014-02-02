/**
 * ActivityLinkTarget
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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

        personId: {
            type: 'integer',
            required: true
        },
        activityLinkId: {
            type: 'integer',
            required: true
        },

        points: 'integer'
    },

    beforeValidation: function(values, next) {
        if (!values.createdAt) {
            values.createdAt = new Date().toISOString();
        }
        values.updatedAt = new Date().toISOString();
        next();
    }
};