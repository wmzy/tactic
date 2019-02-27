import Room from '../room';
import roomList from '../room-list';

export function list(ctx) {
  ctx.body = roomList;
}

export function create(ctx) {
  const room = new Room({id: roomList.length, ...ctx.request.body});
  roomList.push(room);
  ctx.body = room;
}

export function get(ctx) {
  ctx.body = roomList[ctx.params.id - 1];
}
