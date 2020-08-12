import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course{
  desc: string
}

class Crawler {
  private secret= 'x3b174jsx';
  private url = `http://www.dell-lee.com/typescript/demo.html + ${this.secret}`;

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

  async initCrawler() {
    const html = await this.getHtml();
    const courseResult = this.getCourseInfo(html);
  }

  constructor(){
    this.initCrawler();
  }
}

const crawler = new Crawler();