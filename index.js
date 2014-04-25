
var Joi = require('joi');

var schema = Joi.object().keys({
  _id: Joi.optional(),
  name: Joi.string().min(4).max(30).required()
});

function MongoList(conn) {
  if (!(this instanceof MongoList)) {
    return new MongoList(conn);
  }

  if (!conn) {
    throw new Error("missing mongo connection");
  }

  this.db = conn;
}

MongoList.prototype.save = function(list, done) {
  var collection = this.db.collection("lists");

  Joi.validate(list, schema, function(err, obj) {
    if (err) {
      return done(err);
    }

    if (!obj._id) {
      collection.insert(obj, function(err, doc) {
        done(err, doc[0]);
      });
    } else {
      collection.update({ _id: obj._id }, obj, function(err, doc) {
        done(err, obj);
      });
    }
  })
};

MongoList.prototype.load = function(id, done) {
  var collection = this.db.collection("lists");
  collection.findOne({ "_id": id }, function(err, list) {
    if (err) {
      return done(err);
    }

    if (!list) {
      return done(new Error("No such list"));
    }

    done(null, list);
  });
};

module.exports = MongoList;
