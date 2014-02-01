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

            Person.create({ /* Sebu, this is where you come in... */ }, function(err, person) {
                console.log('Created person: ', person);
            });
            Activity.create({ /* Sebu, this is where you come in... */ });
            ActivityLink.create({ /* Sebu, this is where you come in... */ });
            Node.create({ /* Sebu, this is where you come in... */ });

            lowerSails();
        });
    });
});
