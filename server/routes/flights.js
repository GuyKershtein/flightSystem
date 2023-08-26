const express = require('express');
const Flight = require('../models/flight');

const router = express.Router();

// /api/flights
router.get('', async (req, res) => {
    console.log(req.query);
	try {
        let data; 
        if (Object.keys(req.query).length === 0) {
            data = await Flight.find();
        } else {
            let query = { 
                source: req.query.source,
                destination: req.query.destination,
                from: {
                    $gte: new Date(req.query.from) 
                    // ,
                    // $lt: new Date(2012, 7, 15)
                },
                to: {
                    // $gte: new Date(req.query.from) 
                    // ,
                    $lt: new Date(req.query.to)
                }
            };
            if (req.query.displayOnlyDiscounted) {
                query['discountedPrice'] = { $ne: null };
            }
            data = await Flight.find(query);
        }
		res.json(data);
	}
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

// /api/flights
router.post('', async (req, res) => {
	const flight = new Flight({
		source: req.body.source,
		destination: req.body.destination,
		from: req.body.from,
		to: req.body.to,
		price: req.body.price,
		discountedPrice: req.body.discountedPrice
	});
	try {
        const savedData = await flight.save();
        res.status(200).json(savedData);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Flight.findByIdAndUpdate(
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
        const data = await Flight.findByIdAndDelete(id);
        res.status(200).json({});
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
