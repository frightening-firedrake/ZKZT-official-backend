/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/list',
  name: '产品',
  meta: {
    title: '产品',
    icon: 'nested'
  },
  children: [
    {
      path: '/product/list',
      component: () => import('@/views/Product'), // Parent router-view
      name: '产品列表',
      meta: { title: '产品列表' }
    },
    {
      path: '/product/detail/:id(\\d+)',
      component: () => import('@/views/Product/detail'), // Parent router-view
      name: '产品详情',
      meta: { title: '产品详情', activeMenu: '/product/list' },
      hidden: true
    },
    {
      path: '/product/update',
      component: () => import('@/views/Product/update'), // Parent router-view
      name: '产品编辑',
      meta: { title: '产品编辑', activeMenu: '/product/list' },
      hidden: true
    },
    {
      path: '/product/create',
      component: () => import('@/views/Product/create'), // Parent router-view
      name: '产品创建',
      meta: { title: '产品创建', activeMenu: '/product/list' },
      hidden: true
    }
  ]
}

export default productRouter
