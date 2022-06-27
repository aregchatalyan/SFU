const express = require('express');
const _controller = require('./signin.contoller');
const _middleware = require('./signin.middleware');

const router = express.Router();

router.get('/decode', _middleware, _controller.token);

router.get('/:roomId', _middleware, _controller.get);
router.post('/', _middleware, _controller.create);
router.put('/:roomId', _middleware, _controller.update);
router.delete('/:roomId', _middleware, _controller.delete);

module.exports = router;