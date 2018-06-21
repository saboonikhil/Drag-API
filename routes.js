const express = require('express');
const router = express.Router();

router.get('/users', (req, res) =>{
	res.json({
		response: 'GET request for all users'
	});
});

router.post('/users', (req, res) => {
	res.json({
		response: 'POST request for creating users',
		body: req.body
	});
});

router.get('/user/:uID', (req, res) => {
	res.json({
		response: 'GET request for looking at a specific user with id: ${req.params.uID}' 			
	});
});

router.put('/user/:uID', (req,res) => {
	res.json({
		response: 'PUT request for updating user',
		user: req.params.uID,
		body: req.body
	})
})

router.delete('/user/:uID', (req,res) => {
	res.json({
		response: 'DELETE request for DELETING the user',
		user: req.params.uID,
		body: req.body
	});
});

module.exports = router;


