import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import TestAnalyzer from './testAnalyzer';
import SimpleAnalyzer from './simpleAnalyzer';

// 定义Analyzer接口，每个分析器函数都实现该接口，即实现其中的分析方法
export interface Analyzer{
  analyze: (html: string, filepath: string) => string
}

// crawler类，主要是从url中获取html，然后调用分析器处理函数，将处理的结果保存到文件中
class Crawler {
  private filepath = path.resolve(__dirname, '../data/content.json');

  private async getHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  };

  private writeFile(content: string) {
    fs.writeFileSync(this.filepath, content);
  }

  private async initCrawler() {
    const html = await this.getHtml();
    const fileContent = this.analyzer.analyze(html, this.filepath);
    this.writeFile(fileContent);
  }

  constructor(private analyzer: Analyzer, private url: string){
    this.initCrawler();
  }
}

const secret= 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html + ${secret}`;

// 组合模式的调用方式
// const analyzer = new TestAnalyzer(); // 获取课程名称
// const analyzer = new SimpleAnalyzer(); // 获取整个html内容，上下两个分析器做为组合模式使用在crawler中，想使用哪个分析器就创建哪个

// 将分析器采用单例模式实现
const analyzer = TestAnalyzer.getInstance();
new Crawler(analyzer, url);