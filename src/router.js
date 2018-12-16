import Router from 'koa-router';

const router = new Router({prefix: '/api/v1'});
const roomRouter = new Router({prefix: '/rooms'});

router.use(roomRouter.routes());


export default router;
