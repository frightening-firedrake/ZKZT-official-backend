/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const documentRouter = {
  path: '/document',
  component: Layout,
  redirect: '/document/list',
  name: '支持与资料',
  meta: {
    title: '支持与资料',
    icon: 'nested'
  },
  children: [
    {
      path: '/document/list',
      component: () => import('@/views/Document'), // Parent router-view
      name: '资料',
      meta: { title: '资料' }
    },
    {
      path: '/document/detail/:id(\\d+)',
      component: () => import('@/views/Document/detail'), // Parent router-view
      name: '资料详情',
      meta: { title: '资料详情', activeMenu: '/document/list' },
      hidden: true
    },
    {
      path: '/document/update/:id(\\d+)',
      component: () => import('@/views/Document/update'), // Parent router-view
      name: '资料编辑',
      meta: { title: '资料编辑', activeMenu: '/document/list' },
      hidden: true
    },
    {
      path: '/document/create',
      component: () => import('@/views/Document/create'), // Parent router-view
      name: '资料创建',
      meta: { title: '资料创建', activeMenu: '/document/list' },
      hidden: true
    }
  ]
}

export default documentRouter
