const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send("testes");
});

module.exports = router;