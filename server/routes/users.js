const express = require('express');
const User = require('../models/user');

const router = express.Router();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// /api/users
router.get('', async (req, res) => {
    await sleep(1000);
	try {
		const data = await User.find();
		res.json(data);
	}
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

// /api/users
router.post('', async (req, res) => {
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

router.get('/:id', async (req, res) => {
	try {
		const data = await User.findById(req.params.id);
		res.json(data);
	}
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
