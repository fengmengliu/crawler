import router from '../router';
import { RequestHandler } from 'express';

enum Methods {
  get = 'get',
  post = 'post',
  put = 'put'
};
// type Methods = 'get' | 'post'|'put';


// 通过类装饰器，获取每个方法绑定的路由，并根据该路由生成相应的router配置：最终如router.ts的路由表；

export function Controller(root: string) {
  return function (target: new (...args: any[]) => any){
    for(let key in target.prototype){
      const path: string = Reflect.getMetadata('path', target.prototype, key);
      const method: Methods = Reflect.getMetadata('method', target.prototype, key);
      const middleWares: RequestHandler[] = Reflect.getMetadata('middleWares', target.prototype, key) || [];
      const handler = target.prototype[key];
      if(path && method) {
        const fullPath = root === '/' ? path : `${root}${path}`;
        if(middleWares.length) {
          router[method](fullPath, ...middleWares, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  }
}