module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/v1/cart/createCarts',
            handler: 'custom.createCart'
        },
        {
            method: 'POST',
            path: '/v1/cart/deleteCarts',
            handler: 'custom.deleteCart'
        },
        {
            method: 'POST',
            path: '/v1/cart/updateCarts',
            handler: 'custom.updateCart'
        },
        {
            method: 'GET',
            path: '/v1/cart/getCarts',
            handler: 'custom.getList'
        }
    ]
}