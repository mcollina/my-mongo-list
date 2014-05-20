var mylist = require("../");
var cleanDb = require("mongo-clean");
var mongoURL = "mongodb://localhost:27017/mongolisttest";
var expect = require("chai").expect;
var async = require("async");

describe("load all lists", function(done) {
  var instance;

  beforeEach(function(done) {
    cleanDb(mongoURL, function(err, conn) {
      if (err) throw err;

      instance = mylist(conn);
      done(err);
    });
  });

  it("should load all lists", function(done) {
    async.map([
      { name: "aaaa" },
      { name: "bbbb" },
      { name: "cccc" }
    ], function(list, done) {
      instance.save(list, done);
    }, function(err, lists) {
      instance.loadAll(function(err, loaded) {
        expect(loaded).to.eql(lists);
        done();
      });
    });
  });

  it("should load no lists", function(done) {
    instance.loadAll(function(err, loaded) {
      expect(loaded).to.eql([]);
      done();
    });
  });
});
