// 用接口来定义返回值类型
interface Result {
  success: boolean,
  errMsg?: string,
  data: any
}

const getResponseData = (data: any, errMsg?: string) : Result => {
  if(errMsg) {
    return {
      success: false,
      errMsg,
      data
    }
  }else{
    return {
      success: true,
      errMsg,
      data
    } 
  }
}

export default getResponseData;