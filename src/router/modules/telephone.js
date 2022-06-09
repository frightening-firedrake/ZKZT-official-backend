/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const telephoneRouter = {
  path: '/telephone',
  component: Layout,
  redirect: '/telephone/list',
  name: '申请试用',
  meta: {
    title: '申请试用',
    icon: 'link'
  },
  children: [
    {
      path: '/telephone/list',
      component: () => import('@/views/telephone'), // Parent router-view
      name: '申请电话',
      meta: { title: '申请电话' }
    }
    // {
    //   path: '/product/detail/:id(\\d+)',
    //   component: () => import('@/views/Product/detail'), // Parent router-view
    //   name: '产品详情',
    //   meta: { title: '产品详情', activeMenu: '/product/list' },
    //   hidden: true
    // },
    // {
    //   path: '/product/update',
    //   component: () => import('@/views/Product/update'), // Parent router-view
    //   name: '产品编辑',
    //   meta: { title: '产品编辑', activeMenu: '/product/list' },
    //   hidden: true
    // },
    // {
    //   path: '/product/create',
    //   component: () => import('@/views/Product/create'), // Parent router-view
    //   name: '产品创建',
    //   meta: { title: '产品创建', activeMenu: '/product/list' },
    //   hidden: true
    // }
  ]
}

export default telephoneRouter
