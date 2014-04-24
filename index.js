
function MongoList(conn) {
  if (!(this instanceof MongoList)) {
    return new MongoList(conn);
  }

  if (!conn) {
    throw new Error("missing mongo connection");
  }

  this.db = conn;
}

MongoList.prototype.createList = function(list, done) {
  var collection = this.db.collection("lists");

  if (!list.name) {
    return done(new Error("Missing name"));
  }

  collection.insert(list, function(err, doc) {
    done(err, doc[0]);
  });
};

module.exports = MongoList;
