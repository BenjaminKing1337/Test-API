const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("/First Test Collection", () => {
  // connection test
  // it("test default API welcome route", (done) => {
  //   chai
  //     .request(server)
  //     .get("/api/welcome")
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.body.should.be.a("object");
  //       // console.log(res.body.message);

  //       const actualVal = res.body.message;
  //       expect(actualVal).to.be.equal("Welcome to the Art of Assassination");
  //       done();
  //     });
  // });
  // // checking db for 0
  // it("should verify that we have 0 products in the DB", (done) => {
  //   chai
  //     .request(server)
  //     .get("/api/tools")
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.body.should.be.a("array");
  //       res.body.length.should.be.eql(0);
  //       done();
  //     });
  // });
  // // testing post
  // it("should POST a valid tool", (done) => {
  //   let tool = {
  //     name: "Test tool",
  //     description: "Tool for testing",
  //     img: "https://i.imgur.com/ZxJrIRA.png",
  //     type: "Ballistic",
  //     price: "400",
  //     inStock: "true",
  //   };

  //   chai
  //     .request(server)
  //     .post("/api/tools")
  //     .send(tool)
  //     .end((err, res) => {
  //       res.should.have.status(201);
  //       // res.should.have.status(200);
  //       res.body.should.be.a("array");
  //       res.body.length.should.be.eql(1);
  //       done();
  //     });
  // });
  // // checking db for 0
  // // it("should verify that we have 1 products in the DB", (done) => {
  // //   chai
  // //     .request(server)
  // //     .get("/api/tools")
  // //     .end((err, res) => {
  // //       res.should.have.status(200);
  // //       res.body.should.be.a("array");
  // //       res.body.length.should.be.eql(1);
  // //       done();
  // //     });
  // // });
  // // template demo
  // it("should test two values...", () => {
  //   //actual test content in here
  //   let expectedVal = 10;
  //   let actualVal = 10;

  //   expect(actualVal).to.be.equal(expectedVal);
  // });



  // Advanced tests
  it("should register + login a contractor, create tool and verify 1 in DB", (done) => {
    // 1) Register new contractor
    let contractor = {
      name: "Solanum Nomai",
      email: "Echoes@Eye.com",
      pass: "123456",
    };
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the contractor
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "Echoes@Eye.com",
            pass: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new tool
            let tool = {
              name: "Test Tool",
              description: "Test Tool Description",
              img: "https://i.imgur.com/ZxJrIRA.png",
              type: "Ballistic",
              price: 500,
              inStock: true,
            };

            chai
              .request(server)
              .post("/api/tools")
              .set({ "auth-token": token })
              .send(tool)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedTool = res.body[0];
                expect(savedTool.name).to.be.equal(tool.name);
                expect(savedTool.description).to.be.equal(tool.description);
                expect(savedTool.img).to.be.equal(tool.img);
                expect(savedTool.type).to.be.equal(tool.type);
                expect(savedTool.price).to.be.equal(tool.price);
                expect(savedTool.inStock).to.be.equal(tool.inStock);

                // 4) Verify one tool in test DB
                chai
                  .request(server)
                  .get("/api/tools")
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    done();
                  });
              });
          });
      });
  });

  // Valid input test (register, login, )
  it("should register + login a contractor, create tool and delete it from DB", (done) => {
    // 1) Register new contractor
    let contractor = {
      name: "Solanum Nomai",
      email: "Echoes@Eye.com",
      pass: "123456",
    };
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the contractor
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "Echoes@Eye.com",
            pass: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new tool
            let tool = {
              name: "Test Tool",
              description: "Test Tool Description",
              img: "https://i.imgur.com/ZxJrIRA.png",
              type: "Ballistic",
              price: 500,
              inStock: true,
            };

            chai
              .request(server)
              .post("/api/tools")
              .set({ "auth-token": token })
              .send(tool)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedTool = res.body[0];
                expect(savedTool.name).to.be.equal(tool.name);
                expect(savedTool.description).to.be.equal(tool.description);
                expect(savedTool.img).to.be.equal(tool.img);
                expect(savedTool.type).to.be.equal(tool.type);
                expect(savedTool.price).to.be.equal(tool.price);
                expect(savedTool.inStock).to.be.equal(tool.inStock);

                // 4) Delete tool
                chai
                  .request(server)
                  .delete("/api/tools/" + savedTool._id)
                  .set({ "auth-token": token })
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    const actualVal = res.body.message;
                    expect(actualVal).to.be.equal(
                      "Tool was succesfully deleted."
                    );
                    done();
                  });
              });
          });
      });
  });

  // Invalid input test
  it("should register contractor with invalid input", (done) => {
    // 1) Register new contractor with invalid inputs
    let contractor = {
      name: "Solanum Nomai",
      email: "Echoes@Eye.com",
      pass: "123", //Faulty password - Joi/validation should catch this...
    };
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400); //normal expect with no custom output message
        //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail

        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(
          '"pass" length must be at least 6 characters long'
        );
        done();
      });
  });
});
