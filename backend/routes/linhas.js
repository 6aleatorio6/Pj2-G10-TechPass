const express = require('express');
const router = express.Router();
const cors = require('cors')
const prisma = new (require("@prisma/client")).PrismaClient()
const exception = require('../js/erro')



/* retorna todas as linhas. */
router.get("/",cors({origin: "a"}), async function (req, res, next) {
  try {
    const linhas = await prisma.onibus.findMany()

    res.send(JSON.stringify(linhas))

  } catch(er) {
    
    const erro = exception(er)
    res.status(erro.code).send(erro.msg)
  }
});

module.exports = router;
