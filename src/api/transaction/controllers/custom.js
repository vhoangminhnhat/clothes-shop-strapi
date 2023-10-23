module.exports = ({strapi}) => ({
    async getList(ctx) {
       try {
        const {code, name, clothes, fromDate, toDate} = ctx.request.query;
        const list = await strapi.service('api::transaction.custom').get_list({code, name, clothes, fromDate, toDate});
        return list
       } catch (error) {
        console.log(error)
       }
    },
    async createTransaction(ctx){
        try {
            const {customerName, customerPhone, address, carts, paymentMethod, quantity, total}=ctx.request.body;
            const newList = await strapi.service('api::transaction.custom').create_transaction({customerName, customerPhone, address, carts, paymentMethod, quantity, total});
            return newList;
        } catch (error) {
            console.log(error);
        }
    }
})
