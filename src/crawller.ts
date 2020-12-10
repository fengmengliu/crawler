// npm init -y(会出来个package.json); tsc --init;
import superagent from 'superagent'; //需安装类型说明文件 npm i -D @types/superagent
import cheerio from 'cheerio'; // 解析html代码，之后可以类似于jquery的方式获取页面元素
import fs from 'fs';
import path from 'path';

interface Course{
  title: string
}

interface CourseResult{
  time: number,
  data: Course[]
}

interface FileContent{
  [propName: number]: Course[]
}

class Crawller {
  private secret = 'x3b174jsx';
  private url = `http://www.dell-lee.com/?secret=${this.secret}`;
  // __dirname是当前路径
  private filePath = path.resolve(__dirname, '../data/course.json');

  // 根据html获取相关信息
  getCourseJSON(html: string) {
    const courseInfos: Course[] = [];
    const $ = cheerio.load(html);
    const courses = $('.course-item');
    courses.map((index, item) => {
      const desc = $(item).find('.course-desc');
      const title = desc.text(); //保存标题
      courseInfos.push({title})
    });
    return {
      time: new Date().getTime(),
      data: courseInfos
    }
  };

  //获取完整html
  async getRawHtml() {
    const result = await superagent.get(this.url); 
    return result.text;
  }

  //将获取到的信息存储到json文件中
  generateJsonContent(courseResult: CourseResult) {
    let content: FileContent = {};
    if(fs.existsSync(this.filePath)){
      content = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    content[courseResult.time] = courseResult.data;
    return content;
  }

  //将爬取的内容保存的文件中
  saveContentToFile(content:FileContent) {
    fs.writeFileSync(this.filePath, JSON.stringify(content));
  }

  //爬虫初始化方法
  async initCrawllerProcess() {
    const html = await this.getRawHtml();
    const courseResult = this.getCourseJSON(html);
    const content = this.generateJsonContent(courseResult);
    this.saveContentToFile(content);
  }

  constructor(){
    this.initCrawllerProcess();
  }
}

const crawller = new Crawller();
