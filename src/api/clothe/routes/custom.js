module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/v1/clothes/list',
        handler: 'custom.getList',
      },
      {
        method: 'POST',
        path: '/v1/clothes/create',
        handler: 'custom.createList',
      },
      {
        method: 'DELETE',
        path: '/v1/clothes/delete',
        handler: 'custom.deleteList',
      },
      {
        method: 'POST',
        path: '/v1/clothes/update',
        handler: 'custom.updateList',
      },
    ]
  }