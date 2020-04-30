import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/laborday.html'
  },
  {
    path: "/index.html",
    redirect: "/laborday.html"
  },
  //
  {
    path: '/restId=:id',
    // redirect: '/laborday.html?restId=:id'
    component: () => import('../views/laborday/Redirect.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  // 基础活动页面
  {
    path: '/laborday.html',
    component: () => import('../views/laborday/LaborDay.vue')
  },
  {
    path: '/laborday/test',
    component: () => import('../views/laborday/Test.vue')
  },


]

const router = new VueRouter({
  'mode': 'history',
  base: process.env.VUE_APP_PRODUCTION_DIR || '/',
  routes
})


function isIOS() {
  var u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

router.beforeEach((to, from, next) => {
  //ios兼容 充值页面
  if (isIOS()) {
    if (to.name == 'recharge' && !to.query.isios) {
      window.location.href = (process.env.VUE_APP_PRODUCTION_DIR || '/') + 'laborday.html?isios=1'
      return;
    }
  }

  next();

});

export default router
