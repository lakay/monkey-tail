'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var Activity = mongoose.model('Activity');
var ActivityLink = mongoose.model('ActivityLink');
var Person = mongoose.model('Person');
var GraphNode = mongoose.model('GraphNode');

// TODO: test this thoroughly
exports.referenceCode = function(req, res, next) {
    // TODO: make sure the given user is allowed to use the reference code:
    // if the activityLink was created already with an existing user, only that user can enter the code
    var user = req.user;
    var activityLink;
    var personMerged = false;

    var findActivityLink = function(cb) {
        var referenceCode = req.body.referenceCode;
        ActivityLink.findOne({referenceCode: referenceCode}, function(err, link) {
            if (!err && !link) {
                res.status(404);
                err = new Error('Could not find activityLink with referenceCode: ' + referenceCode);
            }
            else if (link.success === true) {
                res.status(409);
                err = new Error('This referenceCode has already been used: ' + referenceCode);
            }
            activityLink = link;
            cb(err);
        });
    };

    var updateActivityLink = function(cb) {
        activityLink.success = true;
        activityLink.save(function(err) {
            cb(err);
        });
    };

    /**
     * If there is a logged in user, sets that Person as the target of the activityLink and
     * removes the "maybe" target Person that turned out to be an already existing user.
     * @param cb
     */
    var mergePerson = function(cb) {
        if (typeof user === 'undefined') {
            // No logged in user, nothing to do
            return cb();
        }
        else {
            // Need to merge
            personMerged = true;

            // Store reference to the old target.
            var oldTarget = activityLink.targets[0];

            // Set the activityLink target to the current user
            activityLink.targets = [user.id];
            // TODO: don't save twice, already saved in updateActivityLink
            activityLink.save(function(err) {
                if (err) {
                    return cb(err);
                }

                // TODO: handle halfway successful merges
                // Delete the now obsolete person
                Person.findByIdAndRemove(oldTarget, function(err) {
                    if (err) {
                        return cb(err);
                    }

                    GraphNode.remove({ target: oldTarget }, function(err) {
                        cb(err);
                    });
                });
            });

        }
    };

    /**
     * Creates the given GraphNode if it doesn't already exist
     * @param owner
     * @param target
     * @param cb
     */
    var createGraphNodeFor = function(owner, target, cb) {
        GraphNode.findOne({owner: owner, target: target}, function(err, node) {
            // If there is an error return it, if the node already exists, there is nothing to do
            if (err || node) {
                return cb(err);
            }

            // Create new node
            var newNode = new GraphNode({
                owner: owner,
                target: target
            });
            newNode.save(function(err) {
                cb(err);
            });
        });
    };

    var createGraphForTarget = function(cb) {
        createGraphNodeFor(
            activityLink.targets[0],
            activityLink.sources[0],
            cb
        );
    };

    var createGraphForSource = function(cb) {
        if (!personMerged) {
            // No person merged, no need to add GraphNode for target
            return cb();
        }
        else {
            createGraphNodeFor(
                activityLink.sources[0],
                activityLink.targets[0],
                cb
            );
        }
    };

    // TODO: better error and input checking along the way
    async.series([
        findActivityLink,
        updateActivityLink,
        mergePerson,
        createGraphForTarget,
        createGraphForSource
    ], function(err) {
        if (err) {
            return next(err);
        }
        else {
            return res.send(_.pick(activityLink, 'referenceCode', 'targets'));
        }
    });
};

exports.link = function(req, res, next) {
    // TODO: document and find a better solution for this async call
    var user = req.user;
    var activity;
    var targetPerson;
    var targetWasCreated = false;
    var activityLink;

    var findActivity = function(cb) {
        if (req.body.activity) {
            Activity.findOne({_id: req.body.activity.id}, function(err, a) {
                // TODO: for some reason, the _id keeps changing when running jasmine tests, so this never works
                if (!err && !a) {
                    // TODO: what type is err usually?
                    err = 'Could not find activity with id: ' + req.body.activity.id;
                }
                activity = a;
                cb(err);
            });
        }
        else {
            cb();
        }
    };

    var createPersonIfNeeded = function(cb) {
        // Check if the person has an id
        var person = req.body.targets[0];
        if (typeof person.id !== 'undefined') {
            // This person already exists TODO: verify it really exists
            targetPerson = person;
            targetWasCreated = false;

            // Check if there are links to the user already
            ActivityLink
                .findOne('', '_id')
                .or([
                    { sources: [user.id], targets: [person.id] },
                    { sources: [person.id], targets: [user.id] }
                ])
                .exec(function(err, link) {
                    if (!err && !link) {
                        // If there isn't an existing link between the user and the target
                        // don't allow the creation of this new link
                        res.status(403);
                        err = new Error('Can not create activity link with a person that you have no link with yet.');
                    }
                    cb(err);
                })
            ;
        }
        else {
            // Create a new person with the given data
            var newPerson = new Person(_.pick(person, 'fullName'));
            newPerson.save(function(err) {
                targetPerson = newPerson;
                targetWasCreated = true;
                cb(err);
            });
        }
    };

    var createNodeIfNeeded = function(cb) {
        if (targetWasCreated) {
            var newNode = new GraphNode({
                owner: user.id,
                target: targetPerson.id
            });
            newNode.save(function(err) {
                cb(err);
            });
        }
        else {
            cb(null);
        }
    };

    var createLink = function(cb) {
        var link = new ActivityLink({
            activity: activity ? activity.id : undefined,
            sources: [user.id],
            targets: [targetPerson.id],
            location: req.body.location,
            startDate: req.body.startDate
        });

        link.save(function(err) {
            activityLink = link;
            cb(err);
        });
    };

    // TODO: better error and input checking along the way
    // TODO: should roll back changes if any later step fails (e.g. startDate is not valid -> person and node is created, but link not)
    async.series([
        findActivity,
        createPersonIfNeeded,
        createNodeIfNeeded,
        createLink
    ], function(err) {
        if (err) {
            return next(err);
        }
        else {
            return res.send(201, _.pick(activityLink, 'referenceCode'));
        }
    });
};

exports.openList = function(req, res, next) {
    var me = req.user;

    // Query all the activityLinks from the logged in user that
    // aren't successful yet
    ActivityLink.find({sources: me.id, success: false})
        .populate('targets', 'fullName')
        .populate('activity', 'name')
        .exec(function(err, links) {
            if (err) {
                return next(err);
            }

            // Massage to the desired format
            links = _.map(links, function(link) {
                return {
                    activity: link.activity.name,
                    targets: _.pluck(link.targets, 'fullName'),
                    referenceCode: link.referenceCode
                };
            });

            return res.send(links);
        })
    ;
};
