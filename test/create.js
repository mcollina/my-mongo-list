
var mylist = require("../");
var cleanDb = require("mongo-clean");
var mongoURL = "mongodb://localhost:27017/mongolisttest";
var expect = require("chai").expect;

describe("creates a list", function(done) {
  var instance;

  beforeEach(function(done) {
    cleanDb(mongoURL, function(err, conn) {
      if (err) throw err;

      instance = mylist(conn);
      done();
    });
  });

  it("should create a new list", function(done) {
    instance.createList({ name: "hello" }, function(err, list) {
      expect(err).to.be.null;
      expect(list).to.have.property('_id');
      done()
    });
  });

  it("should not create a list without a name", function(done) {
    instance.createList({ name: "" }, function(err, list) {
      expect(err.message).to.equal("Missing name");
      done()
    });
  });
});
