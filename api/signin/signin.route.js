const express = require('express');
const _controller = require('./signin.contoller');
const _middleware = require('./signin.middleware');

const router = express.Router();

router.get('/:roomId', _middleware, _controller.get);
router.post('/', _controller.create);
router.put('/:roomId', _controller.update);
router.delete('/:roomId', _controller.delete);

router.get('/decode', _middleware, _controller.token);

module.exports = router;