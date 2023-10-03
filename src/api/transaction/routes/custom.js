module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/v1/transaction/list',
        handler: 'custom.getList',
      },
      {
        method: 'POST',
        path: '/v1/transaction/create',
        handler: 'custom.createTransaction',
      }
    ]
  }