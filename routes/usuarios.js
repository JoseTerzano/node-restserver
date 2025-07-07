const { Router } = require("express");
const { userGet, userPut, userPost, userDelete } = require("../controllers/usuarios");

const router = Router();

router.get('/', userGet);
router.put('/:id', userPut);
router.post('/', userPost);
router.delete('/', userDelete);


module.exports = router;3