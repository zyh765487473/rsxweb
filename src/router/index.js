import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import User from '@/components/User'
import Select from '@/components/Select'
import General from '@/components/General'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/select',
      name: 'select',
      component: Select
    },
    {
      path: '/general',
      name: 'general',
      component: General
    }
  ]
})
