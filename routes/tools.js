// requiring files
const router = require("express").Router();
const tool = require("../models/tools");
const { verifyToken } = require("../validation");
// CRUD operations - /api/tools/
// Create tool - POST with validation
// router.post("/", verifyToken, (req, res) => {
router.post("/", (req, res) => {
  data = req.body;
  tool
    .insertMany(data)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Read all tools - GET - with map operator
router.get("/", (req, res) => {
  tool
    .find()
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Read all tools in stock - GET
router.get("/instock/:status", (req, res) => {
  tool
    .find({ inStock: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
//read price - GET
router.get("/price/:operator/:price", (req, res) => {
  const operator = req.params.operator;
  const price = req.params.price;

  // url filter
  // let filterExpr = { $lte: req.params.price };
  let filterExpr = {};
  if (operator == "gt") filterExpr = { $gte: req.params.price };
  else if (operator == "lt") filterExpr = { $lte: req.params.price };
  else filterExpr = { $lte: req.params.price };

  tool
    .find({ price: filterExpr })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Read specific tool - GET
router.get("/:id", (req, res) => {
  tool
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Update speciic tool - PUT
// router.put("/:id", verifyToken, (req, res) => {
router.put("/:id", (req, res) => {
  const id = req.params.id;
  tool
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot update tool with id=" + id + ". Maybe tool was not found!",
        });
      } else {
        res.send({ message: "tool was succesfully updated." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating tool with id=" + id });
    });
});
// Delete specific tool - DELETE
// router.delete("/:id", verifyToken, (req, res) => {
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  tool
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete tool with id=" +
            id +
            ". Maybe tool was already deleted!",
        });
      } else {
        res.send({ message: "Tool was succesfully deleted." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error deleting tool with id=" + id });
    });
});
// mapping as a function useable in multiple routes.
function mapArray(obj) {
  let outputArr = obj.map((element) => ({
    id: element._id,
    name: element.name,
    description: element.description,
    img: element.img,
    type: element.type,
    price: element.price,
    inStock: element.inStock,
    // link url
    uri: `/api/tools/${element._id}`,
    // uri2:"/api/tools/" + element._id
  }));
  return outputArr;
}
// modular exportation
module.exports = router;
