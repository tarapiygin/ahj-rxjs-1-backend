const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const generateRandomMessage = require('./utils');

const messageList = [];
createMessage = async () => {
  const message = await generateRandomMessage();
  messageList.push(message);
}
const interval = setInterval(() => {
  if (messageList.length >= 300) clearInterval(interval);
  createMessage();
}, 3000);
const app = new Koa();
app.use(cors());
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const router = new Router();
const server = http.createServer(app.callback())

router.get('/messages/unread', async (ctx, next) => {
  let { timestamp } = ctx.request.query;
  console.log(timestamp);
  if (timestamp !== null && timestamp !== '') {
    const messages = messageList.filter(({ received }) => received > timestamp);
    console.log(messages.length);
    timestamp = messages.length !== 0? Math.max(...messages.map(({ received }) => received)) : timestamp;
    ctx.response.body = JSON.stringify({
      status: 'ok',
      timestamp,
      messages,
    });
  } else {
    timestamp = messageList.length !== 0? Math.max(...messageList.map(({ received }) => received)): timestamp;
    ctx.response.body = JSON.stringify({
      status: 'ok',
      timestamp,
      messages: messageList,
    });
  }
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
server.listen(port);
