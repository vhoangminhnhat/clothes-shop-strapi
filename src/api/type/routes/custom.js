module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/v1/types/list',
        handler: 'custom.getList',
      },
    ]
  }