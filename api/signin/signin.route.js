const express = require('express');
const _controller = require('./signin.contoller');
const _middleware = require('./signin.middleware');

const router = express.Router();

router.get('/', _middleware, _controller.get);

router.post('/', _controller.create);

router.put('/:id', _controller.update);

router.delete('/:id', _controller.delete);

module.exports = router;