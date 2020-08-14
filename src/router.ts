import { Router, Request, Response } from 'express';
import TestAnalyzer from './testAnalyzer';
import { Crawler } from './crawler';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('my test');
})
router.get('/getData', (req: Request, res: Response) => {
  const secret= 'x3b174jsx';
  const url = `http://www.dell-lee.com/typescript/demo.html + ${secret}`;
  // 将分析器采用单例模式实现
  const analyzer = TestAnalyzer.getInstance();
  new Crawler(analyzer, url);
  res.send('getData is success!');
})

export default router;