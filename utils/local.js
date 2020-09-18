/**
 * 封装本地存储操作
 * created by 张天师
 */
export default {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};
