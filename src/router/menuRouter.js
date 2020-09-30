/*
 * @Description: 创建菜单栏路由
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-11 14:07:40
 * @LastEditTime: 2019-10-15 10:12:09
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 */
import Home from '../views/layout/Home.vue';

export default [{
    path: '/',
    redirect: {
      name: "index",
      path: '/index',
    },
    component: Home,
    leaf: true,
    isShow: '123',
    children: [{
      path: '/index',
      component: () => import('../views/index/index.vue'),
      name: 'index',
      meta: {
        title: '首页',
        icon: require('../assets/img/home@2x.png'),
        icon1: require('../assets/img/homeActive@2x.png')
      }
    }]
  },
  {
    path: '/mangeCenter',
    redirect: {
      name: 'mangeCenter',
      path: '/mangeCenter'
    },
    component: Home,
    isShow: '2',
    leaf: '123',
    children: [{
      path: '/mangeCenter',
      component: () => import('../views/mange-center/index.vue'),
      name: 'mangeCenter',
      meta: {
        title: '管理中心',
        icon: require('../assets/img/gl@2x.png'),
        icon1: require('../assets/img/glActive@2x.png')
      }
    }]
  },
  {
    path: '/agent',
    redirect: {
      name: 'agent',
      path: '/agent'
    },
    component: Home,
    isShow: '12',
    meta: {
      title: '代理商管理',
      icon: require('../assets/img/dl@2x.png'),
      icon1: require('../assets/img/dlActive@2x.png')
    },
    leaf: false,
    unfold: true,
    children: [{
        path: '/agent',
        component: () => import('../views/agent/index.vue'),
        name: 'agent',
        meta: {
          title: '代理商管理'
        }
      },
      {
        path: '/agentScale',
        component: () => import('../views/agent/agent-scale.vue'),
        name: 'agentScale',
        meta: {
          title: '代理商等级'
        }
      },
      {
        path: '/agentData',
        component: () => import('../views/agent/agent-data.vue'),
        name: 'agentData',
        meta: {
          title: '代理商数据'
        }
      }
    ]
  },
  {
    path: '/shop',
    redirect: {
      name: 'shop',
      path: '/shop'
    },
    component: Home,
    leaf: true,
    isShow: '12',
    children: [{
      path: '/shop',
      component: () => import('../views/shop/index.vue'),
      name: 'shop',
      meta: {
        title: '店铺管理',
        icon: require('../assets/img/dp@2x.png'),
        icon1: require('../assets/img/dpActive@2x.png')
      }
    }]
  },
  {
    path: '/staff',
    redirect: {
      name: 'staff',
      path: '/staff'
    },
    component: Home,
    leaf: true,
    isShow: '2',
    children: [{
      path: '/staff',
      component: () => import('../views/staff/index.vue'),
      name: 'staff',
      meta: {
        title: '员工管理',
        icon: require('../assets/img/yg@2x.png'),
        icon1: require('../assets/img/ygActive@2x.png')
      }
    }]
  },
  {
    path: '/commodity',
    redirect: {
      name: 'commodity',
      path: '/commodity'
    },
    component: Home,
    leaf: true,
    isShow: '123',
    children: [{
      path: '/commodity',
      component: () => import('../views/commodity/index.vue'),
      name: 'commodity',
      meta: {
        title: '商品管理',
        icon: require('../assets/img/sp@2x.png'),
        icon1: require('../assets/img/spActive@2x.png')
      }
    }]
  },
  {
    path: '/mangeForm',
    redirect: {
      name: 'mangeForm',
      path: '/mangeForm'
    },
    component: Home,
    meta: {
      title: '表单管理',
      icon: require('../assets/img/form@2x.png'),
      icon1: require('../assets/img/formActive@2x.png')
    },
    leaf: false,
    unfold: true,
    isShow: '1',
    children: [{
        path: '/mangeForm',
        component: () => import('../views/mange-form/index.vue'),
        name: 'mangeForm',
        meta: {
          title: '新购单管理'
        }
      },
      {
        path: '/renew',
        component: () => import('../views/mange-form/renew.vue'),
        name: 'renew',
        meta: {
          title: '续费单管理'
        }
      },
      {
        path: '/rechargeForm',
        component: () => import('../views/mange-form/recharge.vue'),
        name: 'rechargeForm',
        meta: {
          title: '充值单管理'
        }
      }
    ]
  },
  {
    path: '/topUpAudit',
    redirect: {
      name: 'topUpAudit',
      path: '/topUpAudit'
    },
    component: Home,
    leaf: true,
    isShow: '1',
    children: [{
      path: '/topUpAudit',
      component: () => import('../views/topup-audit/index.vue'),
      name: 'topUpAudit',
      meta: {
        title: '充值审核',
        icon: require('../assets/img/cz@2x.png'),
        icon1: require('../assets/img/czActive@2x.png')
      }
    }]
  },
  {
    path: '/performance',
    redirect: {
      name: 'performance',
      path: '/performance'
    },
    component: Home,
    leaf: true,
    isShow: '23',
    children: [{
      path: '/performance',
      component: () => import('../views/performance/index.vue'),
      name: 'performance',
      meta: {
        title: '我的业绩',
        icon: require('../assets/img/yj@2x.png'),
        icon1: require('../assets/img/yjActive@2x.png')
      }
    }]
  },
  {
    path: '/form',
    redirect: {
      name: 'form',
      path: '/form'
    },
    component: Home,
    leaf: true,
    isShow: '23',
    children: [{
      path: '/form',
      component: () => import('../views/form/index.vue'),
      name: 'form',
      meta: {
        title: '我的表单',
        icon: require('../assets/img/form@2x.png'),
        icon1: require('../assets/img/formActive@2x.png')
      }
    }]
  },
  {
    path: '/info',
    redirect: {
      name: 'info',
      path: '/info'
    },
    component: Home,
    leaf: true,
    isShow: '12',
    children: [{
      path: '/info',
      component: () => import('../views/info/index.vue'),
      name: 'info',
      meta: {
        title: '消息通知',
        icon: require('../assets/img/info@2x.png'),
        icon1: require('../assets/img/infoActive@2x.png')
      }
    }]
  },
  {
    path: '/setting',
    redirect: {
      name: 'setting',
      path: '/setting'
    },
    component: Home,
    meta: {
      title: '设置',
      icon: require('../assets/img/sz@2x.png'),
      icon1: require('../assets/img/szActive@2x.png')
    },
    leaf: false,
    unfold: true,
    isShow: '12',
    children: [{
        path: '/setting',
        component: () => import('../views/setting/index.vue'),
        name: 'setting',
        meta: {
          title: '企业信息'
        }
      },
      {
        path: '/setPay',
        component: () => import('../views/setting/set-pay.vue'),
        name: 'setPay',
        meta: {
          title: '支付设置'
        }
      }
    ]
  }
]