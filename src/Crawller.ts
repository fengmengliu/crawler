// npm init -y(会出来个package.json); tsc --init;
import superagent from 'superagent'; //需安装类型说明文件 npm i -D @types/superagent
import fs from 'fs';
import path from 'path';
import MyAnalyzer from './MyAnalyzer';

// 此接口的定义是有讲究的，因为本文件需要使用的方法只有一个，所以在定义这个接口的时候，根据使用的方法来定义，同时，导出这个接口，在另一个页面进行实现；
export interface Analyzer{
  analyze: (html: string, filePath: string)=> string
}

class Crawller {

  // __dirname是当前路径
  private filePath = path.resolve(__dirname, '../data/course.json');

  //获取完整html
  private async getRawHtml() {
    const result = await superagent.get(this.url); 
    return result.text;
  }

  //将爬取的内容保存到文件中
  private saveContentToFile(content:string) {
    fs.writeFileSync(this.filePath, content);
  }

  //爬虫初始化方法
  private async initCrawllerProcess() {
    const html = await this.getRawHtml();
    const content = this.analyzer.analyze(html, this.filePath);
    this.saveContentToFile(content);
  }

  constructor(private url: string, private analyzer: Analyzer){
    this.initCrawllerProcess();
  }
}


const secret = 'x3b174jsx';
const url = `http://www.dell-lee.com/?secret=${secret}`;
const analyzer = MyAnalyzer.getInstance();
const crawller = new Crawller(url, analyzer);
