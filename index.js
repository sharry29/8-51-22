const server = require('server'); var xss = require("xss"); const {get, socket}
= server.router; const { render } = server.reply; var id_to_username = {}; const
updateCounter = ctx => { // console.log(Object.keys(ctx.io.sockets.sockets));
ctx.io.emit('count', Object.keys(ctx.io.sockets.sockets).length); }; const
handleDisconnect = ctx => { // console.log("after DC"); //
console.log(Object.keys(ctx.io.sockets.sockets)); ctx.io.emit('count',
Object.keys(ctx.io.sockets.sockets).length); const connected_set = new
Set(Object.keys(ctx.io.sockets.sockets)); var users = [] for (const [id,
username] of Object.entries(id_to_username)) { if (!(id in connected_set)) {
users.push(username); delete id_to_username[id]; } } ctx.io.emit('leave',
users); }; const sendMessage = ctx => { ctx.data.message =
xss(ctx.data.message); ctx.io.emit('message', ctx.data); }; const sendJoin = ctx
=> { id_to_username[ctx.data.id] = ctx.data.user; ctx.io.emit('join', ctx.data);
// console.log(id_to_username) }; server([ // for the inital render get('/chat',
ctx => render('chatroom.html')), get('/snake', ctx => render('snake.html')),
get('/', ctx => render('index.html')), get('/cfa', ctx =>
render('apartments.html')), // get('/stylometry', ctx =>
render('/public/ModernCorefVoiceAA.pdf')), // Joining/leaving room
socket('connect', updateCounter), socket('disconnect', handleDisconnect),
socket('message', sendMessage), socket('join', sendJoin) ]);
