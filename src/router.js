import Router from 'koa-router';
import * as roomController from './controllers/room';

const router = new Router({prefix: '/api/v1'});
const roomRouter = new Router({prefix: '/rooms'});
roomRouter
  .get('/', roomController.list)
  .get('/:id', roomController.get)
  .post('/', roomController.create)
;

router.use(roomRouter.routes());


export default router;
