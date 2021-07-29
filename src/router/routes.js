import { LocalStorage } from 'quasar'
const routes = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      let isAuth = LocalStorage.getItem('isAuth')
      if(!isAuth && to.path === '/home'){
        next('/')
      }else{
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/Home.vue') },
      { path: '/help', component: () => import('src/pages/Help.vue') },
      { path: '/settings', component: () => import('src/pages/Settings.vue') },
      { path: '/my-blogs', component: () => import('src/pages/MyBlogs.vue') },
      { name: 'profile',path: '/profile/:user', component: () => import('src/pages/Profile.vue') },
      { name: 'post',path: '/post/:post', component: () => import('src/pages/Post.vue') },
      { name: 'users',path: '/users', component: () => import('src/pages/Users.vue') },
      { name: 'chat',path: '/chat/:user', component: () => import('src/pages/Chat.vue') }
    ]

  },
  {
    path: '/',
    component: () => import('../pages/auth/Login.vue'),
    beforeEnter: (to, from, next) => {
      let isAuth = LocalStorage.getItem('isAuth')
      if(isAuth && to.path === '/'){
        next('/home')
      }else{
        next()
      }
    },
  },
  {
    path: '/signup',
    component: () => import('../pages/auth/SignUp.vue'),
    beforeEnter: (to, from, next) => {
      let isAuth = LocalStorage.getItem('isAuth')
      if(isAuth && to.path === '/signup'){
        next('/home')
      }else{
        next()
      }
    },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
