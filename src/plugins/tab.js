import store from '@/store'
import router from '@/router';

export default {
  // 关闭当前tab页签
  closeOpenPage(obj) {
    store.dispatch("tagsView/delView", router.currentRoute);
    if (obj !== undefined) {
      return router.push(obj);
    }
  },
}
