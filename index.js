
var Joi      = require('joi');
var ObjectID = require('mongodb').ObjectID;
var schema   = Joi.object().keys({
  _id: Joi.optional(),
  name: Joi.string().min(4).max(30).required(),
  items: Joi.array().includes(Joi.object().keys({
    name: Joi.string().required(),
    completed: Joi.boolean().default(false)
  }))
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
        done(err, idToString(doc[0]));
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
  collection.findOne({ _id: new ObjectID(id) }, function(err, list) {
    if (err) {
      return done(err);
    }

    if (!list) {
      return done(new Error("No such list"));
    }

    done(null, idToString(list));
  });
};

MongoList.prototype.remove = function(id, done) {
  var collection = this.db.collection("lists");
  collection.remove({ _id: new ObjectID(id) }, function(err, list) {
    if (err) {
      return done(err);
    }

    if (!list) {
      return done(new Error("No such list"));
    }

    done(null);
  });
};

function idToString(doc) {
  if (doc) {
    doc._id = doc._id.toString();
  }

  return doc;
}

module.exports = MongoList;
