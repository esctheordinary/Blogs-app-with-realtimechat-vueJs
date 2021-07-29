import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import auth from './store-module/store-auth'
import userSettings from './store-module/store-settings'
import post from './store-module/store-post'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      userSettings,
      post
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  })
  window.store = Store
  return Store
})
