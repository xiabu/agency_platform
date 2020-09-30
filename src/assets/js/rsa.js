/*
 * @Description: 敏感信息加密
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-10-10 16:48:05
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-10-21 09:01:47
 */
import JSEncrypt from 'jsencrypt';

export const rsaJsencrypt = (str) => {
  let pubKey = "-----BEGIN PUBLIC KEY-----" +
  "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJ420ot4DhEjcZCA\r\n" + "Ag3P68gKjXAuU/yWnrsUu/gH5ZnYTYW5/pBeyPmGoTCFpS3lrk7zAvW6CGgP9Ajv\r\n"
  + "PJOuBpzmYnCPwb6TFpjCDxQiC23EEdXClJsDaO8vPdwedZzyeudIvFl7+47xs7yS\r\n" + "/ickIV9pZiGNcbfTSnWFSZtCO9PbAgMBAAECgYBJY6TGjSn5STekj7xkK85zPHHf\r\n" + "V54dzMBUh4mpw//9HRjYry4mSdFv7cNXfqbgY2o3tQHqeiDsJHpOqqqu1kq6QmAw\r\n"
  + "IiGI133drXtHpN568Gg5Jqf2lukf5npQcVZNX9tWxJuowR4hMdQSokMZx3osxhlY\r\n" + "VSaJ8PPeyPgp4NEGAQJBAM4zYzn4z/42Sj4joz+gbjSHeF0HiJecU9b3KE3AQ+4c\r\n" + "Wxm3s8WF9COT+DhzSFLcc9aAVscCi3KU873aY7m6AUcCQQDEbJsPCLRvF+jUAz8H\r\n"
  + "0r9M9C//8znGE0lLHuWR3T2dFmhYF6rcILN2XbVYNCIYx/u9bEXNczkdW+i+njdS\r\n" + "p8LNAkAwaMwQ3iMmkWRYtlErLOTynCNb49rjjSX5v8jMiCjqi+mvXftskghBGgoa\r\n" + "ZqZCHdNsNnEpA6XtXp7ioZTsE4kdAkA6SRvt5yBbgtXE672tXZ0EgcUohw0SuLBc\r\n"
  + "CSwID4Vz8q09zrAVp+J48i+Yn8eqYNVTjShdYZ6GFrrGrX4vGbbVAkEAnXm8AMXv\r\n" + "+5RFv0JxSj+ehx3TtQHbTonuZt628TcMCamognW6BRoxSkxCznMY04OkE3pCpY2g\r\n" + "PU/xyJhSCfz27A==" + "-----END PUBLIC KEY-----"; // ES6 模板字符串 引用 rsa 公钥
  let encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubKey); // 设置 加密公钥
  let data = encryptStr.encrypt(str); // 进行加密
  return data;
};