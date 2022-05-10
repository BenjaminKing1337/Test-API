process.env.NODE_ENV = "test";

const Tool = require("../models/tools");
const Contractor = require("../models/contractor");

beforeEach((done) => {
  Tool.deleteMany({}, function (err) {});
  Contractor.deleteMany({}, function (err) {});
  done();
});
afterEach((done) => {
  Tool.deleteMany({}, function (err) {});
  Contractor.deleteMany({}, function (err) {});
  done();
});
