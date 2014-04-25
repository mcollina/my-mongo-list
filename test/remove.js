var mylist = require("../");
var cleanDb = require("mongo-clean");
var mongoURL = "mongodb://localhost:27017/mongolisttest";
var expect = require("chai").expect;

describe("remove a list", function(done) {
  var instance;
  var list;

  beforeEach(function(done) {
    cleanDb(mongoURL, function(err, conn) {
      if (err) throw err;

      instance = mylist(conn);
      instance.save({ name: "hello" }, function(err, doc) {
        list = doc;
        done();
      });
    });
  });

  it("should remove a list", function(done) {
    instance.remove(list._id, function(err, loaded) {
      expect(err).to.be.null;
      instance.load(list._id, function(err, loaded) {
        expect(err.message).to.equal("No such list");
        done()
      });
    });
  });

  it("should err if there is no such list", function(done) {
    instance.remove("abcdefabcdef", function(err, list) {
      expect(err.message).to.equal("No such list");
      done()
    });
  });
});
