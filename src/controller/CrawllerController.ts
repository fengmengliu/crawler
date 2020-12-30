import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata'; //注意此库直接引用就可以了，不用指定具体的对象名
import { Controller, get, use } from '../decorator';
import getResponseData from '../util/util';
import Crawller from '../util/Crawller';
import MyAnalyzer from '../util/MyAnalyzer';

interface RequestBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (req: RequestBody, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false); // 通过!!转换成boolean型
  console.log('checklogin middleware');
  if(isLogin){
    next();
  }else{
    res.json(getResponseData(false, `请先登录`));
  }
}

const test = (req: RequestBody, res: Response, next: NextFunction): void => {
  console.log('test middleware');
  next();
}

@Controller('/api')
export class CrawllerController{
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData(req: RequestBody, res: Response): void {
    const secret = 'x3b174jsx';
    const url = `http://www.dell-lee.com/?secret=${secret}`;
    const crawller = new Crawller(url, MyAnalyzer.getInstance());
    res.json(getResponseData(true));
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: RequestBody, res: Response): void {
    try{
      const filePath = path.resolve(__dirname, '../../data/course.json')
      const content = fs.readFileSync(filePath, 'utf-8');
      res.json(getResponseData(JSON.parse(content)));
    }catch(e){
      res.json(getResponseData(false, '暂无爬取数据'));
    }
  };
}