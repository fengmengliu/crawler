// ts有类型融合机制，会将此处定义的.d.ts文件和node-module下面的.d.ts文件进行融合 // 此文件叫什么名字都行，但是扩展名要是.d.ts
declare namespace Express{
  interface Request{
    teacherName: string
  }
}