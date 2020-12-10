import cheerio from 'cheerio'; // 解析html代码，之后可以类似于jquery的方式获取页面元素
import fs from 'fs';
import {Analyzer} from './crawller';

export default class myAnalyzer implements Analyzer{

  public analyze(html: string, filePath: string): string {
    console.log(html);
    return html;
  }
}