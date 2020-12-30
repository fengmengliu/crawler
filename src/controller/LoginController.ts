import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata'; //注意此库直接引用就可以了，不用指定具体的对象名
import { Controller, get, post } from '../decorator';
import getResponseData from '../util/util';

interface RequestBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

@Controller('/api')
export class LoginController{

  static isLogin(req: RequestBody): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @get('/logout')
  logout(req: RequestBody, res: Response): void {
    req.session && (req.session.login = undefined);
    res.json(getResponseData(true));
  }

  @get('/isLogin')
  isLogin(req: RequestBody, res: Response): void {
    const isLogin = LoginController.isLogin(req)
    res.json(getResponseData(isLogin));
  }

  @post('/login')
  login(req: RequestBody, res: Response): void {
    const { password } = req.body; //没有使用body-parser中间件时，获取不到body中数据
    const isLogin = LoginController.isLogin(req);
    if(isLogin){
      res.json(getResponseData(true));
    }else{
      if(password === '123' && req.session){
        req.session.login = true;
        res.json(getResponseData(true));
      }else{
        res.json(getResponseData(false, '请输入正确的密码'));
      }
    }
  };

}