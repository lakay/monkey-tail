/**
 * Sets up fixtures in the database
 */

'use strict';

var Sails = require('sails');

// Shamelessly copied from https://github.com/derickbailey/jasmine.async
function runAsync(block){
    var done = false;
    var complete = function(){ done = true; };

    runs(function(){
        block(complete);
    });

    waitsFor(function(){
        return done;
    });
}

var sails;  // global sails instance. Blame jasmine's poor async support :-/

function liftSails() {
    runAsync(function(done) {
        Sails.lift({
            log: { level: 'error' }
        }, function(err, s) {
            sails = s;
            done();
        });
    });
}

function lowerSails() {
    runAsync(sails.lower);
}

describe('Our database', function () {
    it('contains useful data', function () {
        liftSails();

        runs(function() {
            Activity.destroy({}).done(function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('All activities have been deleted');
                }
            });

            ActivityLink.destroy({}).done(function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('All activity links have been deleted');
                }
            });

            Node.destroy({}).done(function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('All nodes have been deleted');
                }
            });

            Person.destroy({}).done(function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('All people have been deleted');
                }
            });

            Person.create({ email: 'foo@bar.baz',  password: 'bestpasswordever', firstName: 'Alice', lastName: 'Alison'}, function(err, person) {
                console.log('Created person: ', person);
            });
			
			Person.create({ email: 'im@stoop.id', password: 'bestpasswordever', lastName: 'Burton', gender: 'male'}, function(err, person) {
                console.log('Created person: ', person);
            });
			
			Person.create({ email: 'son@ainbfl.at', password: 'youllneverguess', firstName: 'Carol', gender: 'other', address: 'Cäcilienstr. 5, 3006 Bern'}, function(err, person) {
                console.log('Created person: ', person);
            });
			
			Person.create({ firstName: 'Dave', lastName: 'Donaldson'}, function(err, person) {
                console.log('Created person: ', person);
            });
			
            Activity.create({ name: 'Buy something vegan for ... at a shop/supermarket', className: 'Shopping', givesVegBites: 'false' }, function(err, activity) {
                console.log("Activity created: ", activity);
				Person.findOneByEmail("foo@bar.baz").done(function(err, source) {
				    Person.findOneByEmail("im@stoop.id").done(function(err, target) {
						ActivityLink.create({ activityId: activity.id, sourceIds: [source.id], targetIds: [target.id], location: 'Bern, Switzerland', startDateTime: '2014-02-02 T08:04' });
						Node.create({ ownderId: source.id, targetId: target.id });
						Person.findOneByEmail("son@ainbfl.at").done(function(err, nodetarget) {
							Node.create({ ownderId: source.id, targetId: nodetarget.id });
						});
						Person.findOneByFirstName("Dave").done(function(err, nodetarget) {
							Node.create({ ownderId: source.id, targetId: nodetarget.id });
						});
					});
				});	
            });
			
            Activity.create({ name: 'Buy something vegan with ... at a shop/supermarket', className: 'Shopping', givesVegBites: 'false' }, function(err, activity) {
                console.log("Activity created: ", activity);
				Person.findOneByEmail("foo@bar.baz").done(function(err, source) {
				    Person.findOneByEmail("son@ainbfl.at").done(function(err, target) {
						ActivityLink.create({ activityId: activity.id, sourceIds: [source.id], targetIds: [target.id], location: 'Zürich, Switzerland', startDateTime: '2014-01-31 T10:40', success: 'true', pointsForSource: [0] });
					});
				});	
            });
			
            Activity.create({ name: 'Go eat something vegan at restaurant/take away with ...', className: 'Restaurant', givesVegBites: 'true' }, function(err, activity) {
                console.log("Activity created: ", activity);
				Person.findOneByEmail("im@stoop.id").done(function(err, source) {
				    Person.findOneByEmail("son@ainbfl.at").done(function(err, target) {
						ActivityLink.create({ activityId: activity.id, sourceIds: [source.id], targetIds: [target.id], location: 'Basel, Switzerland', startDateTime: '2014-02-05' });
					});
				});	
            });
			
            Activity.create({ name: 'Cook/bake/prepare something vegan for ...', className: 'Self', givesVegBites: 'true' }, function(err, activity) {
                console.log("Activity created: ", activity);
				Person.findOneByEmail("im@stoop.id").done(function(err, source) {
				    Person.findOneByFirstName("Dave").done(function(err, target) {
						ActivityLink.create({ activityId: activity.id, sourceIds: [source.id], targetIds: [target.id], location: 'Wabern, Switzerland', startDateTime: '2014-02-03 T16:00' });
					});
				});	
            });
			
            
			
            

            lowerSails();
        });
    });
});
