const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

//Register
router.post('/register', async(req, res) => {

    //Validate incoming data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');
    const nameExists = await User.findOne({ name: req.body.name });
    if (nameExists) return res.status(400).send('Name already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new yser
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: savedUser.id });
    } catch (error) {
        res.status(400).send(err);
    }
});

//Login

router.post('/login', async(req, res) => {
    //Validate incoming data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email or password is wrong');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);

});


module.exports = router;