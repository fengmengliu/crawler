import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crawler';

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

export default class TestAnalyzer implements Analyzer{
  private constructor() {}; // 单例模式不允许类在外部被实例化；同时正因为没被实例化，所以需要定义instance为static方法，方便类直接调用; 同时获取instance的方法也为static类型
  private static instance: TestAnalyzer;
  public static getInstance() {
    if(!TestAnalyzer.instance){
      TestAnalyzer.instance = new TestAnalyzer();
    }
    return TestAnalyzer.instance;
  }
  private getCourseInfo(html: string) {
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
  private getJsonData(courseResult: CourseInfo, filepath: string) {
    let fileContent: Content = {};
    if(fs.existsSync(filepath)){ // 取出文件中存储的数据
      fileContent = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
    // 添加新的数据
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
  };

  public analyze(html: string, filepath: string) {
    const courseResult: CourseInfo = this.getCourseInfo(html);
    const fileContent = this.getJsonData(courseResult, filepath);
    return JSON.stringify(fileContent);
  };
}