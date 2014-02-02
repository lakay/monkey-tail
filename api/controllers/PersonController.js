/**
 * PersonController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

'use strict';

var _ = require('underscore');

module.exports = {
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PersonController)
     */
    _config: {},

    me: function(req, res) {
        Person.findOneByEmail(req.param('email')).done(function(err, person) {
            console.log('err: ', err, 'person: ', person);
            if (err || !person) {
                return res.send(404);
            }

            Node.find({ownerId: person.id}).done(function(err, nodes) {
                console.log('Got: ', err, ' and ', nodes);

                _.each(nodes, function(n) {
                    n.name = n.getTarget().fullName();
                });
            });

            res.json(person);
        });
    }
};
