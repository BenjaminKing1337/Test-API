process.env.NODE_ENV = "test";

const Tool = require("../models/tools");
const Contractor = require("../models/contractor");

before((done) => {
  Tool.deleteMany({}, function (err) {});
//   Contractor.deleteMany({}, function (err) {});
  done();
});
after((done) => {
  Tool.deleteMany({}, function (err) {});
//   Contractor.deleteMany({}, function (err) {});
  done();
});
