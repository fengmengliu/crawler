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
  }
}