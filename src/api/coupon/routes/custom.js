module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/v1/coupons/list',
        handler: 'custom.getList',
      },

      {
        method: 'POST',
        path: '/v1/coupons/add',
        handler: 'custom.addCoupon',
      },
    ]
  }