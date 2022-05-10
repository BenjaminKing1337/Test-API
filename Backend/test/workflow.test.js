const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../Backend/server");

chai.use(chaiHttp);

describe("/First Test Collection", () => {
  
  it("Register contractor & login", (done) => {
    let contractor = {
      name: "Agent 47",
      email: "47@47.47",
      pass: "474747",
    };
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "47@47.47",
            pass: "474747",
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            done();
          });
      });
  });

  it("Register contractor (with invalid password) and fail registration", (done) => {
    let contractor = {
      name: "Agent 47",
      email: "47@47.47",
      pass: "123",
    };
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(
          '"pass" length must be at least 6 characters long'
        );
        done();
      });
  });

  it("Register contractor, login, create tool & verify it in DB", (done) => {
    let contractor = {
      name: "Agent 47",
      email: "47@47.47",
      pass: "474747",
    };
    // Register
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);
        // login
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "47@47.47",
            pass: "474747",
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let tool = {
              name: "Test Tool",
              description: "Test Tool Description",
              img: "https://i.imgur.com/ZxJrIRA.png",
              type: "Ballistic",
              price: 500,
              inStock: true,
            };
            // Create
            chai
              .request(server)
              .post("/api/tools")
              .set({ "auth-token": token })
              .send(tool)
              .end((err, res) => {
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
                // Verify
                chai
                  .request(server)
                  .get("/api/tools")
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    done();
                  });
              });
          });
      });
  });

  it("Register contractor, login, create tool, verify & delete it from DB", (done) => {
    let contractor = {
      name: "Agent 47",
      email: "47@47.47",
      pass: "474747",
    };
    // Register
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);
        // Login
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "47@47.47",
            pass: "474747",
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let tool = {
              name: "Test Tool",
              description: "Test Tool Description",
              img: "https://i.imgur.com/ZxJrIRA.png",
              type: "Ballistic",
              price: 500,
              inStock: true,
            };
            // Create
            chai
              .request(server)
              .post("/api/tools")
              .set({ "auth-token": token })
              .send(tool)
              .end((err, res) => {
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
                // Verify
                chai
                  .request(server)
                  .get("/api/tools")
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);
                  });
                // Delete
                chai
                  .request(server)
                  .delete("/api/tools/" + savedTool._id)
                  .set({ "auth-token": token })
                  .end((err, res) => {
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

  it("Register contractor, login, create tool, verify, update & then delete it from DB", (done) => {
    let contractor = {
      name: "Agent 47",
      email: "47@47.47",
      pass: "474747",
    };
    // Register
    chai
      .request(server)
      .post("/api/contractors/register")
      .send(contractor)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);
        // Login
        chai
          .request(server)
          .post("/api/contractors/login")
          .send({
            email: "47@47.47",
            pass: "474747",
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let tool = {
              name: "Test Tool",
              description: "Test Tool Description",
              img: "https://i.imgur.com/ZxJrIRA.png",
              type: "Ballistic",
              price: 500,
              inStock: true,
            };
            // Create
            chai
              .request(server)
              .post("/api/tools")
              .set({ "auth-token": token })
              .send(tool)
              .end((err, res) => {
                res.should.have.status(201);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);
                let savedTool = res.body[0];
                expect(savedTool.name).to.be.equal(tool.name);
                expect(savedTool.description).to.be.equal(tool.description);
                expect(savedTool.img).to.be.equal(tool.img);
                expect(savedTool.type).to.be.equal(tool.type);
                expect(savedTool.price).to.be.equal(tool.price);
                expect(savedTool.inStock).to.eql(tool.inStock);

                let toolUpdated = {
                  name: "Test Tool Update",
                  description: "Test Tool Description Update",
                  img: "https://i.imgur.com/ZxJrIRA.png",
                  type: "Melee",
                  price: 100,
                  inStock: false,
                };
                // Update
                chai
                  .request(server)
                  .put("/api/tools/" + savedTool._id)
                  .set({ "auth-token": token })
                  .send(toolUpdated)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    expect(res.body.message).to.be.equal(
                      "tool was succesfully updated."
                    );
                    // Verify
                    chai
                      .request(server)
                      .get("/api/tools")
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.be.eql(1);
                      });
                    // Delete
                    chai
                      .request(server)
                      .delete("/api/tools/" + savedTool._id)
                      .set({ "auth-token": token })
                      .end((err, res) => {
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
  });
});
