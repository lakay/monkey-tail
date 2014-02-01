/**
 * Unit tests for the Person model and controller.
 */

'use strict';

var _ = require('underscore');

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

describe('A Person', function() {
    it('can be created empty', function() {
        // FIXME: we currently only lift sails in the first test, because lowering sails fails.
        liftSails();
        var person;
        runAsync(function(done) {
            Person.create({}, function(err, p) {
                person = p;
                done();
            })
        });
        runs(function() {
            expect(person.alienName).toMatch(/Zorg-\d+/);
            expect(person.createdAt.getTime() - (new Date()).getTime()).toBeCloseTo(0, -2);
            expect(person.updatedAt.getTime() - (new Date()).getTime()).toBeCloseTo(0, -2);
            expect(person.id).toBeTruthy();
        });
    });

    it('validates the date of birth', function() {
        var person;
        var err;

        _.each(['2013-02-01', '2013'], function(t) {
            runAsync(function(done) {
                Person.create({dateOfBirth: t}, function(e, p) {
                    person = p;
                    err = e;
                    done();
                });
            });
            runs(function() {
                expect(person.dateOfBirth).toBe(t);
                expect(err).toBeNull();
            });
        });

        _.each(['2013-foo', 'this is not a valid date'], function(t) {
            runAsync(function(done) {
                Person.create({dateOfBirth: t}, function(e, p) {
                    person = p;
                    err = e;
                    done();
                });
            });
            runs(function() {
                expect(err).toBeTruthy();
            });
        });

    });
});
