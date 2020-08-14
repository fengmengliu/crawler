"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var TestAnalyzer = /** @class */ (function () {
    function TestAnalyzer() {
    }
    ; // 单例模式不允许类在外部被实例化；同时正因为没被实例化，所以需要定义instance为static方法，方便类直接调用; 同时获取instance的方法也为static类型
    TestAnalyzer.getInstance = function () {
        if (!TestAnalyzer.instance) {
            TestAnalyzer.instance = new TestAnalyzer();
        }
        return TestAnalyzer.instance;
    };
    TestAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html); // 将html字符串传递给load方法，类似于获取到了jquery对象；之后就是和jquery一样的操作了
        var courseInfos = [];
        var courseItems = $('.course-item');
        courseItems.map(function (index, element) {
            var desc = $(element).find('.course-desc').text();
            courseInfos.push({ desc: desc });
        });
        return {
            time: new Date().getTime(),
            data: courseInfos
        };
    };
    ;
    TestAnalyzer.prototype.getJsonData = function (courseResult, filepath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filepath)) { // 取出文件中存储的数据
            fileContent = JSON.parse(fs_1.default.readFileSync(filepath, 'utf-8'));
        }
        // 添加新的数据
        fileContent[courseResult.time] = courseResult.data;
        return fileContent;
    };
    ;
    TestAnalyzer.prototype.analyze = function (html, filepath) {
        var courseResult = this.getCourseInfo(html);
        var fileContent = this.getJsonData(courseResult, filepath);
        return JSON.stringify(fileContent);
    };
    ;
    return TestAnalyzer;
}());
exports.default = TestAnalyzer;
