'use strict';
/* global it, expect */

var h = require('../helpers');

h.describe('Graph API methods', function() {
    it('can get me', function() {
        h.runAsync(function(done) {
            h.request('GET', h.baseURL + 'graph/me').end(function(res) {
                expect(res.statusCode).toBe(200);

                // Make sure we get nodes and links
                expect(typeof res.body.nodes).toEqual('object');
                expect(typeof res.body.links).toEqual('object');

                // Check that there's the right amount of nodes and links
                expect(Object.keys(res.body.nodes).length).toBe(5);
                expect(res.body.links.length).toBe(4);

                // TODO: check that not too much information is exposed (no names or num activity infos for friends of friends)
                done();
            });
        });
    });

    it('cannot get graph of a full user if not logged in as that user', function() {
        h.runAsync(function(done) {
            h.request('GET', h.baseURL + 'graph/000000000000000000000001').end(function(res) {
                expect(res.statusCode).toBe(403);
                done();
            });
        }) ;
    });

    it('can get graph of a maybe user', function() {
        h.runAsync(function(done) {
            h.request('GET', h.baseURL + 'graph/000000000000000000000003').end(function(res) {
                expect(res.statusCode).toBe(200);

                expect(typeof res.body.nodes).toEqual('object');
                expect(typeof res.body.links).toEqual('object');
                expect(Object.keys(res.body.nodes).length).toBe(4); // 1 me, 1 the other use, 2 friends of that friend
                expect(res.body.links.length).toBe(3);
                done();
            });
        });
    });

    it('can update the graph', function() {
        h.runAsync(function(done) {
            h.request('PUT', h.baseURL + 'graph').end(function(res) {
                //TODO define behavior here
                expect(res.statusCode).toBe(200);
                expect(res.body.status).toEqual('OK');
                done();
            });
        });
    });
});
