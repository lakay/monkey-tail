/**
 * Unit tests for the Person model and controller.
 */
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

describe('A Person', function() {
    it('can be created empty', function() {
        var sails;

        runAsync(function(done) {
            Sails.lift({
                log: { level: 'error' }
            }, function(err, s) {
                sails = s;
                done();
            });
        });

        runs(function() {
            expect(sails).toBeDefined();
        });

        var person;
        runAsync(function(done) {
            Person.create({}, function(err, p) {
                person = p;
                console.log('err = ', err);
                console.log('p = ', p);
                done();
            })
        });
        runs(function() {
            expect(person.alienName).toMatch(/Zorg-\d+/);
            sails.lower();
        });

    });
});
