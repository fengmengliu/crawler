import {CrawllerController, LoginController} from '../controller';
enum Methods {
  get = 'get',
  post = 'post',
  put = 'put'
};
// type Methods = 'get' | 'post'|'put';

// 获取不同请求装饰器[工厂函数]  --- 该类的方法装饰器会在类的装饰器之前执行；--- 进行了路由和方法的绑定；
function getRequestDecorator(type: Methods) {
  return function(path: string){
    return function(target: CrawllerController | LoginController, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
    }
  }
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
