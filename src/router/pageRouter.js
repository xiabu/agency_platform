/*
 * @Description: 创建页面路由
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-11 14:07:40
 * @LastEditTime: 2019-10-15 18:08:15
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 */
import Home from '../views/layout/Home.vue'
export default [{
    path: '/mangeCenter/recharge',
    redirect: {
      name: 'recharge',
      path: '/mangeCenter/recharge'
    },
    component: Home,
    children: [{
      path: '/mangeCenter/recharge',
      component: () => import('../views/mange-center/recharge.vue'),
      name: 'recharge',
      meta: {
        title: '申请充值'
      }
    }]
  },
  {
    path: '/mangeCenter/rechargeRecord',
    redirect: {
      name: 'rechargeRecord',
      path: '/mangeCenter/rechargeRecord'
    },
    component: Home,
    children: [{
      path: '/mangeCenter/rechargeRecord',
      component: () => import('../views/mange-center/recharge-record.vue'),
      name: 'rechargeRecord',
      meta: {
        title: '充值记录'
      }
    }]
  },
  {
    path: '/mangeCenter/particulars',
    redirect: {
      name: 'particulars',
      path: '/mangeCenter/particulars'
    },
    component: Home,
    children: [{
      path: '/mangeCenter/particulars',
      component: () => import('../views/mange-center/particulars.vue'),
      name: 'particulars',
      meta: {
        title: '收支明细'
      }
    }]
  },
  {
    path: '/mangeCenter/mangeForm',
    redirect: {
      name: 'centerMangeForm',
      path: '/mangeCenter/mangeForm'
    },
    component: Home,
    children: [{
      path: '/mangeCenter/mangeForm',
      component: () => import('../views/mange-center/mange-form.vue'),
      name: 'centerMangeForm',
      meta: {
        title: '提交表单'
      }
    }]
  },
  {
    path: '/agent/dredge',
    redirect: {
      name: 'agentDredge',
      path: '/agent/dredge'
    },
    component: Home,
    children: [{
      path: '/agent/dredge',
      component: () => import('../views/agent/dredge.vue'),
      name: 'agentDredge',
      meta: {
        title: '开通代理商'
      }
    }]
  },
  {
    path: '/agent/detail/:proxyId',
    redirect: {
      name: 'agentDetail',
      path: '/agent/detail/:proxyId'
    },
    component: Home,
    children: [{
      path: '/agent/detail/:proxyId',
      component: () => import('../views/agent/detail.vue'),
      name: 'agentDetail',
      meta: {
        title: '代理商详情'
      }
    }]
  },
  {
    path: '/agent/dataDetail/:proxyId',
    redirect: {
      name: 'dataDetail',
      path: '/agent/dataDetail/:proxyId'
    },
    component: Home,
    children: [{
      path: '/agent/dataDetail/:proxyId',
      component: () => import('../views/agent/dataDetail.vue'),
      name: 'dataDetail',
      meta: {
        title: '查看详情'
      }
    }]
  },
  {
    path: '/shop/edit',
    redirect: {
      name: 'shopEdit',
      path: '/shop/edit'
    },
    component: Home,
    children: [{
      path: '/shop/edit/:shopId',
      component: () => import('../views/shop/edit.vue'),
      name: 'shopedit',
      meta: {
        title: '修改'
      }
    }, {
      path: '/shop/addShopAndOpenAccunt',
      component: () => import('../views/shop/edit.vue'),
      name: 'addShopAndOpenAccunt',
      meta: {
        title: '开通账号'
      }
    }]
  },
  {
    path: '/form/detail/:id',
    redirect: {
      name: 'formDetail',
      path: '/form/detail/:id'
    },
    component: Home,
    children: [{
      path: '/form/detail/:id',
      component: () => import('../views/form/detail.vue'),
      name: 'formDetail',
      meta: {
        title: '表单详情'
      }
    }]
  },
  {
    path: '/agent/formDetail/:id',
    redirect: {
      name: 'agentFormDetail',
      path: '/agent/formDetail/:id'
    },
    component: Home,
    children: [{
      path: '/agent/formDetail/:id',
      component: () => import('../views/agent/formDetail.vue'),
      name: 'agentFormDetail',
      meta: {
        title: '表单详情'
      }
    }]
  },
  {
    path: '/mange-center/mangeFormDetail/:id',
    redirect: {
      name: 'mangeFormDetail',
      path: '/mange-center/mangeFormDetail/:id'
    },
    component: Home,
    children: [{
      path: '/mange-center/mangeFormDetail/:id',
      component: () => import('../views/mange-center/mangeFormDetail.vue'),
      name: 'mangeFormDetail',
      meta: {
        title: '查看详情'
      }
    }]
  },
  {
    path: '/jurisdiction',
    redirect: {
      name: 'jurisdiction',
      path: '/jurisdiction'
    },
    component: Home,
    children: [{
      path: '/jurisdiction',
      component: () => import('../views/error/jurisdiction.vue'),
      name: 'jurisdiction',
      meta: {
        title: '403页面'
      }
    }]
  },
  {
    path: '/noFind',
    redirect: {
      name: 'noFind',
      path: '/noFind'
    },
    component: Home,
    children: [{
      path: '/noFind',
      component: () => import('../views/error/noFind.vue'),
      name: 'noFind',
      meta: {
        title: '404页面'
      }
    }]
  },
  {
    path: '/server',
    redirect: {
      name: 'server',
      path: '/server'
    },
    component: Home,
    children: [{
      path: '/server',
      component: () => import('../views/error/server.vue'),
      name: 'server',
      meta: {
        title: '500页面'
      }
    }]
  },
  {
    path: '/commodity/addOrEdit',
    redirect: {
      name: 'addOrEdit',
      path: '/commodity/addOrEdit'
    },
    component: Home,
    children: [{
      path: '/commodity/addOrEdit',
      component: () => import('../views/commodity/addOrEdit.vue'),
      name: 'addOrEdit',
      meta: {
        title: '添加商品'
      }
    }]
  },
  {
    path: '/commodity/addOrEdit1',
    redirect: {
      name: 'addOrEdit1',
      path: '/commodity/addOrEdit1'
    },
    component: Home,
    children: [{
      path: '/commodity/addOrEdit1/:id',
      component: () => import('../views/commodity/addOrEdit.vue'),
      name: 'addOrEdit1',
      meta: {
        title: '修改商品'
      }
    }]
  },
  {
    path: '/index/lowActive',
    redirect: {
      name: 'lowActive',
      path: '/index/lowActive'
    },
    component: Home,
    children: [{
      path: '/index/lowActive/:id',
      component: () => import('../views/index/low-active.vue'),
      name: 'lowActive',
      meta: {
        title: '低活跃商家排行'
      }
    }]
  }
]