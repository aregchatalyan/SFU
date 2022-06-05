const express = require('express');
const _controller = require('./git.controller');

const router = express.Router();

router.get('/', _controller.pull);
router.post('/', _controller.pull);

module.exports = router;