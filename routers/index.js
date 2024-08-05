const { Router } = require('express')
const parser_router = Router()

const parserCtrl = require('../controllers/parser')
parser_router.post('/parser/read', parserCtrl.readFile)

module.exports= {
    parser_router
}