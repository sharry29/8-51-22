const server = require('server')
const { get, socket } = server.router
const { render } = server.reply
server([get('/', ctx => render('docs/index.html'))])
