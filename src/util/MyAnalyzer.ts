import cheerio from 'cheerio'; // 解析html代码，之后可以类似于jquery的方式获取页面元素
import fs from 'fs';
import {Analyzer} from './Crawller'

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

export default class MyAnalyzer implements Analyzer{

  private static instance: MyAnalyzer;
  private constructor() {};
  static getInstance() {
    if(!MyAnalyzer.instance) {
      MyAnalyzer.instance = new MyAnalyzer();
    }
    return MyAnalyzer.instance;
  }

  // 根据html获取相关信息
  private getCourseJSON(html: string) {
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
  //将获取到的信息存储到json文件中
  private generateJsonContent(courseResult: CourseResult, filePath: string) {
    let content: FileContent = {};
    if(fs.existsSync(filePath)){
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    content[courseResult.time] = courseResult.data;
    return content;
  }

  public analyze(html: string, filePath: string): string {
    const courseResult = this.getCourseJSON(html);
    const content = this.generateJsonContent(courseResult, filePath);
    return JSON.stringify(content);
  }
}