
var mylist = require("../");
var cleanDb = require("mongo-clean");
var mongoURL = "mongodb://localhost:27017/mongolisttest";
var expect = require("chai").expect;

describe("saves a list", function(done) {
  var instance;

  beforeEach(function(done) {
    cleanDb(mongoURL, function(err, conn) {
      if (err) throw err;

      instance = mylist(conn);
      done();
    });
  });

  it("should create a new list", function(done) {
    instance.save({ name: "hello" }, function(err, list) {
      expect(err).to.be.null;
      expect(list).to.have.property('_id');
      done()
    });
  });

  it("should not create a list without a name", function(done) {
    instance.save({ name: "" }, function(err, list) {
      expect(err.message).to.equal("name is not allowed to be empty");
      done()
    });
  });

  it("should update a list", function(done) {
    instance.save({ name: "hello" }, function(err, list) {
      list.name = "hello matteo";
      instance.save(list, function(err, list2) {
        expect(err).to.be.null;
        expect(list2).to.eql(list);
        done();
      });
    });
  });
});
