import Koa from 'koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import router from './router';

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes());

export default app;
