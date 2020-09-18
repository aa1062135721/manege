/**
 * 项目中通用的正则表达式
 * created by 张天师
 */

// 账号的正则  ( 3到12位（字母，数字，下划线，减号） )
export const accReg = /^[\u4E00-\u9FA5a-zA-Z0-9_-]{3,12}$/;

// 密码的正则   ( 3到12位（字母，数字，下划线，减号） )
export const pwdReg = /^[a-zA-Z0-9_-]{3,12}$/;
