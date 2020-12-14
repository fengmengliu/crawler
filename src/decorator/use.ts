import {RequestHandler} from 'express';
import {CrawllerController, LoginController} from '../controller';

// 返回中间件装饰器工厂函数
//作用：将传入的中间件绑定到方法中
export const use = function(middleWare: RequestHandler) {
  return function(target: CrawllerController | LoginController, key: string) {
    const originMiddleWares = Reflect.getMetadata('middleWares', target, key) || []; //存储多个装饰器
    originMiddleWares.push(middleWare);
    Reflect.defineMetadata('middleWares', originMiddleWares, target, key);
  }
}
