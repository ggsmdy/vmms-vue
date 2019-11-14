import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * vmms中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  //登录
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        icon: 'md-desktop',
        meta: {
          hideInMenu: true,
          title: '总览',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path:'/display',
    name:'display',
    meta: {
      hideInMenu: true,
      title: '展示模式'
    },
    component: () => import('@/view/single-page/display')
  },
  {
    path: '/operator',
    name: 'operator',
    meta: {
      icon: 'md-podium',
      title: '统计',
      access: ['op-sale-chart', 'op-member-chart', 'op-member-view', 'op-consume-order']
    },
    component: Main,
    children: [
      {
        path: '/operator/sale_chart',
        name: 'saleChart',
        meta: {
          icon: 'md-stats',
          title: '销售统计',
          access: ['op-sale-chart']
        },
        component: () => import('@/view/chart/sale')
      },
      {
        path: '/operator/member_chart',
        name: 'memberChart',
        meta: {
          icon: 'md-pie',
          title: '会员统计',
          access: ['op-member-chart']
        },
        component: () => import('@/view/chart/member')
      },
      {
        path: '/operator/member',
        name: 'memberView',
        meta: {
          icon: 'md-person',
          title: '用户列表',
          access: ['op-member-view']
        },
        component: () => import('@/view/webapp/member')
      },
      {
        path: '/operator/order',
        name: 'consumeOrder',
        meta: {
          icon: 'md-list-box',
          title: '商品交易明细',
          access: ['op-consume-order']
        },
        component: () => import('@/view/order/consume')
      }
    ]
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  {
    path: '/point',
    name: 'point',
    meta: {
      icon: 'md-podium',
      title: '点位',
      access: ['op-sale-chart', 'op-member-chart', 'op-member-view']
    },
    component: Main,
    children: [
      {
        path: '/point/area',
        name: 'areaMd',
        meta: {
          icon: 'md-stats',
          title: '区域管理',
          access: ['op-sale-chart']
        },
        component: () => import('@/view/point/area')
      },
      {
        path: '/point/line',
        name: 'lineMd',
        meta: {
          icon: 'md-pie',
          title: '线路管理',
          access: ['op-member-chart']
        },
        component: () => import('@/view/point/line')
      },
      {
        path: '/point/point',
        name: 'pointMd',
        meta: {
          icon: 'md-person',
          title: '点位管理',
          access: ['op-member-view']
        },
        component: () => import('@/view/point/point')
      }
    ]
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: '/machine',
    name: 'machine',
    meta: {
      icon: 'md-desktop',
      title: '机器',
      access: ['mc-machine-list', 'mc-machine-alarm', 'mc-machine-map', 'mc-machine-text']
    },
    component: Main,
    children: [
      {
        path: '/machine/list',
        name: 'machineList',
        meta: {
          icon: 'md-list',
          title: '机器列表',
          access: ['mc-machine-list']
        },
        component: () => import('@/view/machine/list')
      },
      {
        path: '/machine/models',
        name: 'machineModels',
        meta: {
          icon: 'md-list',
          title: '机型列表',
          access: ['mc-machine-list']
        },
        component: () => import('@/view/machine/models')
      },
      {
        path: '/machine/loading',
        name: 'machineLoading',
        meta: {
          icon: 'md-list',
          title: '机器货道',
          access: ['mc-machine-list']
        },
        component: () => import('@/view/machine/loading')
      },
      {
        path: '/machine/aisle',
        name: 'machineAisle',
        meta: {
          icon: 'md-list',
          title: '货道列表',
          access: ['mc-machine-aisle']
        },
        component: () => import('@/view/machine/aisle')
      },
      {
        path: '/machine/alarm',
        name: 'machineAlarm',
        meta: {
          icon: 'md-sad',
          title: '告警信息',
          access: ['mc-machine-alarm']
        },
        component: () => import('@/view/machine/alarm')
      },
      {
        path: '/machine/map',
        name: 'machineMap',
        meta: {
          icon: 'md-map',
          title: '地图',
          access: ['mc-machine-map']
        },
        component: () => import('@/view/machine/map')
      },
      {
        path: '/machine/text',
        name: 'machineText',
        meta: {
          icon: 'md-map',
          title: '收益分成',
          access: ['mc-machine-map']
        },
        component: () => import('@/view/machine/text')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'md-cog',
      title: '补货',
      access: ['od-purchase-online', 'od-purchase-order', 'od-stuff-remain']
    },
    component: Main,
    children: [
      {
        path: '/order/replenish',
        name: 'purchaseOnline',
        meta: {
          icon: 'md-add',
          title: '原材料补货',
          access: ['od-purchase-online']
        },
        component: () => import('@/view/order/replenish')
      },
      {
        path: '/order/delivery',
        name: 'purchaseOrder',
        meta: {
          icon: 'md-clipboard',
          title: '原材料订单',
          access: ['od-purchase-order']
        },
        component: () => import('@/view/order/delivery')
      },
      {
        path: '/order/remain',
        name: 'stuffRemain',
        meta: {
          icon: 'md-copy',
          title: '原材料库存',
          access: ['od-stuff-remain']
        },
        component: () => import('@/view/order/remain')
      },
      {
        path: '/order/addr',
        name: 'addrManager',
        meta: {
          icon: 'md-send',
          title: '地址管理',
          access: ['od-purchase-online']
        },
        component: () => import('@/view/system/address')
      }
    ]
  },
  {
    path: '/warning',
    name: 'warning',
    meta: {
      icon: 'md-cog',
      title: '警告',
      access: ['od-purchase-online', 'od-purchase-order', 'od-stuff-remain']/*'wn-warning-list', 'wn-warning-affair'*/
    },
    component: Main,
    children: [
      {
        path: '/warning/list',
        name: 'warningList',
        meta: {
          icon: 'md-add',
          title: '警告列表',
          access: ['od-stuff-remain']
        },
        component: () => import('@/view/warning/list')
      },
      {
        path: '/warning/affair',
        name: 'warningAffair',
        meta: {
          icon: 'md-clipboard',
          title: '警告事件',
          access: ['od-purchase-order']
        },
        component: () => import('@/view/warning/affair')
      }
    ]
  },
  {
    path: '/advertising',
    name: 'advertising',
    meta: {
      icon: 'md-cog',
      title: '广告服务',
      access: ['od-purchase-online', 'od-purchase-order', 'od-stuff-remain']/*'wn-warning-list', 'wn-warning-affair'*/
    },
    component: Main,
    children: [
      {
        path: '/advertising/list',
        name: 'advertisingList',
        meta: {
          icon: 'md-add',
          title: '广告列表',
          access: ['od-stuff-remain']
        },
        component: () => import('@/view/advertising/list')
      },
      {
        path: '/advertising/machine',
        name: 'advertisingMachine',
        meta: {
          icon: 'md-clipboard',
          title: '机器广告',
          access: ['od-purchase-order']
        },
        component: () => import('@/view/advertising/machine')
      }
    ]
  },
  {
    path: '/webapp',
    name: 'webapp',
    meta: {
      icon: 'md-disc',
      title: '小程序管理',
      access: ['mini-member-manager', 'mini-recharge-config', 'mini-integral-config']
    },
    component: Main,
    children: [
      {
        path: '/webapp/member',
        name: 'memberManager',
        meta: {
          icon: 'md-person',
          title: '用户列表',
          access: ['mini-member-manager']
        },
        component: () => import('@/view/webapp/member')
      },
      {
        path: '/webapp/recharge',
        name: 'rechargeConfig',
        meta: {
          icon: 'logo-usd',
          title: '充值活动',
          access: ['mini-recharge-config']
        },
        component: () => import('@/view/webapp/recharge')
      },
      {
        path: '/webapp/integral',
        name: 'integralConfig',
        meta: {
          icon: 'md-flower',
          title: '积分活动',
          access: ['mini-integral-config']
        },
        component: () => import('@/view/webapp/integral')
      }
    ]
  },
  {
    path: '/goods',
    name: '商品管理',
    meta: {
      // hideInMenu: true,
      // notCache: true
      icon: 'md-flower',
      access: ['goods-manager']
    },
    component: Main,
    children: [
      {
        path: '/goods/list',
        name: 'goodsManager',
        meta: {
          icon: 'md-ice-cream',
          title: '机器商品发布',
          access: ['goods-manager']
        },
        component: () => import('@/view/webapp/goods')
      }
    ]
  },
  {
    path: '/stuff',
    name: '原料管理',
    meta: {
      // hideInMenu: true,
      // notCache: true,
      icon: 'md-flower',
      access: ['stuff-manager']
    },
    component: Main,
    children: [
      {
        path: '/stuff/list',
        name: 'stuffManager',
        meta: {
          icon: 'md-water',
          title: '原材料商品发布',
          access: ['stuff-manager']
        },
        component: () => import('@/view/machine/stuff')
      }
    ]
  },
  {
    path: '/message',
    name: '消息推送',
    meta: {
      // hideInMenu: true,
      // notCache: true
      icon: 'md-flower',
      access: ['mini-message-send']
    },
    component: Main,
    children: [
      {
        path: '/message/list',
        name: 'messageList',
        meta: {
          icon: 'md-chatbubbles',
          title: '小程序消息发布',
          access: ['mini-message-send']
        },
        component: () => import('@/view/webapp/message')
      },
      {
        path: '/message/add/',
        name: 'addMessage',
        props: true,
        meta: {
          icon: 'md-chatbubbles',
          title: '增加消息',
          hideInMenu: true,
          hideInTag: true,
          access: ['mini-message-send']
        },
        component: () => import('@/view/webapp/message/add')
      },
      {
        path: '/message/edit/:msgId',
        name: 'editMessage',
        props: true,
        meta: {
          icon: 'md-chatbubbles',
          title: '编辑消息',
          hideInMenu: true,
          hideInTag: true,
          access: ['mini-message-send']
        },
        component: () => import('@/view/webapp/message/edit')
      },
    ]
  },
  {
    path: '/system',
    name: '_system',
    meta: {
      icon: 'md-cog',
      title: '系统管理',
      access: ['sys-user-manager'],
    },
    component: Main,
    children: [
        {
          path: 'role',
          name: 'roleList',
          meta: {
            icon: 'md-add',
            title: '角色管理',
            access: ['sys-user-manager']
          },
          component: () => import('@/view/system/role')
        },
        {
        path: 'user',
        name: 'userManager',
        meta: {
          icon: 'md-person',
          title: '账号添加管理',
          access: ['sys-user-manager']
        },
        component: () => import('@/view/system/user')
        }
      // {
      //   path: 'group',
      //   name: 'group',
      //   meta: {
      //     icon: 'md-people',
      //     title: '群组管理',
      //     access: ['group_manage']
      //   },
      //   component: () => import('@/view/system/group')
      // }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
