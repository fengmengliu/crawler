import {Router} from 'express';

export const router = Router();

enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put'
};
// type Method = 'get' | 'post'|'put';

export function Controller(target: any){
  for(let key in target.prototype){
    const path = Reflect.getMetadata('path', target.prototype, key);
    const method: Method = Reflect.getMetadata('method', target.prototype, key);
    const handler = target.prototype[key];
    router[method](path, handler);
  }
}

function getRequestDecorator(method: string) {
  return function(path: string){
    return function(target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    }
  }
}

export const get = getRequestDecorator('get');
export const post = getRequestDecorator('post');
export const put = getRequestDecorator('put');
