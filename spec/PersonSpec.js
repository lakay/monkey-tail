/**
 * Unit tests for the Person model and controller.
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

describe('A Person', function() {
    beforeEach(function() {
        liftSails();
    });

    afterEach(function() {
        sails.lower();
    });

    it('can be created empty', function() {
        var person;
        runAsync(function(done) {
            Person.create({}, function(err, p) {
                person = p;
                done();
            })
        });
        runs(function() {
            expect(person.alienName).toMatch(/Zorg-\d+/);
            expect(person.createdAt.getTime() - (new Date()).getTime()).toBeCloseTo(0, -1);
            expect(person.updatedAt.getTime() - (new Date()).getTime()).toBeCloseTo(0, -1);
            expect(person.id).toBeTruthy();
        });
    });
});
