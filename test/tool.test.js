
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);



describe("/First Test Collection", () => {
  // connection test
  it("test default API welcome route", (done) => {
    chai
      .request(server)
      .get("/api/welcome")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        // console.log(res.body.message);

        const actualVal = res.body.message;
        expect(actualVal).to.be.equal("Welcome to the Art of Assassination");
        done();
      });
  });
  // checking db for 0
  it("should verify that we have 0 products in the DB", (done) => {
    chai
      .request(server)
      .get("/api/tools")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });
  // testing post
  it("should POST a valid tool", (done) => {
    let tool = {
      name: "Test tool",
      description: "Tool for testing",
      img: "https://i.imgur.com/ZxJrIRA.png",
      type: "Ballistic",
      price: "400",
      inStock: "true",
    };

    chai
      .request(server)
      .post("/api/tools")
      .send(tool)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  // checking db for 0
  it("should verify that we have 1 products in the DB", (done) => {
    chai
      .request(server)
      .get("/api/tools")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        done();
      });
  });
  // template demo
  it("should test two values...", () => {
    //actual test content in here
    let expectedVal = 10;
    let actualVal = 10;

    expect(actualVal).to.be.equal(expectedVal);
  });
});
