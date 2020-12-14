import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata'; //注意此库直接引用就可以了，不用指定具体的对象名
import { Controller, get, post } from '../decorator';
import getResponseData from '../util/util';

interface RequestBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

@Controller('/')
export class LoginController{

  @get('/logout')
  logout(req: RequestBody, res: Response): void {
    req.session && (req.session.login = undefined);
    res.json(getResponseData(true));
  }

  @get('/')
  home(req: RequestBody, res: Response): void {
    const isLogin = !!(req.session ? req.session.login : false);
    if(isLogin) {
      res.send(`
      <html>
        <body>
          <a href='/getData'>爬取内容</a>
          <a href='/showData'>展示数据</a>
          <a href='/logout'>确认退出</a>
        </body>
      </html>
    `)
    }else{
      res.send(`
      <html>
        <body>
          <form method='post' action='/login'>
            <input placeholder='请输入密码' name="password">
            <button>提交</button>
          </form>
        </body>
      </html>
    `);
    }
  }

  @post('/login')
  login(req: RequestBody, res: Response): void {
    const { password } = req.body; //没有使用body-parser中间件时，获取不到body中数据
    const isLogin = !!(req.session ? req.session.login : false);
    if(isLogin){
      res.json(getResponseData(false, '您已登录过'));
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