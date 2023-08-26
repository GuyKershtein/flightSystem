const express = require('express');
const User = require('../models/user');

const router = express.Router();

// login
router.post('', async (req, res) => {
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

module.exports = router;
