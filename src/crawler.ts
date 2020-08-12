import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course{
  desc: string
}

interface CourseInfo{
  time: number,
  data: Course[]
}

interface Content{
  [propName: number]: Course[]
}

class Crawler {
  private secret= 'x3b174jsx';
  private url = `http://www.dell-lee.com/typescript/demo.html + ${this.secret}`;
  private filepath = path.resolve(__dirname, '../data/content.json');

  getCourseInfo(html: string) {
    const $ = cheerio.load(html); // 将html字符串传递给load方法，类似于获取到了jquery对象；之后就是和jquery一样的操作了
    const courseInfos: Course[] = [];
    const courseItems = $('.course-item');
    courseItems.map((index, element) => {
      const desc = $(element).find('.course-desc').text();
      courseInfos.push({ desc });
    })
    return {
      time: new Date().getTime(),
      data: courseInfos
    }
  };

  async getHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  };

  getJsonData(courseResult: CourseInfo) {
    let fileContent: Content = {};
    if(fs.existsSync(this.filepath)){ // 取出文件中存储的数据
      fileContent = JSON.parse(fs.readFileSync(this.filepath, 'utf-8'));
    }
    // 添加新的数据
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
  };

  writeFile(content: string) {
    fs.writeFileSync(this.filepath, content);
  }

  async initCrawler() {
    const html = await this.getHtml();
    const courseResult: CourseInfo = this.getCourseInfo(html);
    const fileContent = this.getJsonData(courseResult);
    this.writeFile(JSON.stringify(fileContent));
  }

  constructor(){
    this.initCrawler();
  }
}

const crawler = new Crawler();