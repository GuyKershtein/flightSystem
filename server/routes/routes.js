const express = require('express');
const User = require('../models/user');

const router = express.Router();

// login
router.post('/login', async (req, res) => {
    try {
        console.log('in /login')
        const data = await User.findOne({email: req.body.email});
        if (!data || data.password !== req.body.password) {
            console.log('in /login 404')
            res.status(404).json({});
        } else {
            console.log('in /login 200')
            res.status(200).json(data);
        }
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});


// users
router.get('/users', async (req, res) => {
	try {
		const data = await User.find();
		res.json(data);
	}
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/users', async (req, res) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password,
		role: req.body.role
	});
	try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.get('/users/:id', async (req, res) => {
	try {
		const data = await User.findById(req.params.id);
		res.json(data);
	}
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        );

        res.send(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id);
        res.status(200).json({});
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
