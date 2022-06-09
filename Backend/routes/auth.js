// importing model and deps
const router = require('express').Router();
const Contractor = require('../models/contractor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//importing validations
const { registerValidation, loginValidation } = require('../validation');
const { application } = require('express');
// ROUTE - /registration
router.post("/register", async (req, res) => {

    // validate contractor input
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    // check if the email is already registered
    const emailExist = await Contractor.findOne({ email: req.body.email });

    if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.pass, salt);

    // create contractor object and save in db
    const contractorObject = new Contractor({
        name: req.body.name,
        email: req.body.email,
        pass
    });

    try {
        const savedContractor = await contractorObject.save();
        res.json({ error: null, data: savedContractor._id });
    } catch (error) {
        res.status(400).json({ error })
    }

    // test Register route
    // return res.status(200).json({ msg: "Register route..." });
});
// ROUTE - /login
router.post("/login", async (req, res) => {

    // validate contractor login info
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    // if login info is valid, find the contractor
    const contractor = await Contractor.findOne({ email: req.body.email });

    // throw error if email is wrong (contractor does not exist in DB)
    if (!contractor) {
        return res.status(400).json({ error: "Email is wrong" });
    }

    // contractor exists - check for password correctness
    const validPass = await bcrypt.compare(req.body.pass, contractor.pass)

    // throw errror if password is incorrect
    if (!validPass) {
        return res.status(400).json({ error: "Password is wrong" });
    }

    // create auth token with contractorname and id
    const token = jwt.sign(
        //payload
        {
            name: contractor.name,
            email: contractor.email,
            id: contractor._id
        },
        // TOKEN_SECRET
        process.env.TOKEN_SECRET,
        // EXPIRATION TIME
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // attach auth token to header
    res.header("auth-token", token).json({
        error: null,
        data: { token }
    })



    // test login route
    // return res.status(200).json({ msg: "Login route..." });
});
// // ROUTE - / Read all Contractors - GET - with map operator
// router.get("/", (req, res) => {
//     Contractor.find()
//         .then(data => {
//             res.send(mapArray(data));
//         })
//         .catch(err => { res.status(500).send({ message: err.message }); })
// }
// );

// Read all contractors - GET
router.get("/", (req, res) => {
    Contractor.find()
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); })
}
);

// mapping as a function useable in multiple routes.
function mapArray(obj) {

    let outputArr = obj.map(element => (
        {
            id: element._id,
            name: element.name,
            email: element.email,
            pass: element.pass,
            date: element.date,
            // link url
            uri: `/api/contractors/${element._id}`,
            // uri2:"/api/contractors/" + element._id
        }
    ));
    return outputArr;
};
// modular exportation
module.exports = router;