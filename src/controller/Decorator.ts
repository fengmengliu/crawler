export function get(path: string){
  return function(target: any, key: string){
    Reflect.defineMetadata('path', path, target, key); // 将路由和相应的方法绑定在一起
  }
}

export function controller(target: any) {
  for(let key in target.prototype){
    console.log(Reflect.getMetadata('path', target.prototype, key));
  }
}