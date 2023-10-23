const _ = require("lodash");
module.exports = ({ strapi }) => ({
  async create_transaction({customerName, customerPhone, address, carts, paymentMethod, quantity, total}){
    if(!_.isEmpty(customerName)){
      return {messege: "Tên không được để trống"}
    };
    if(_.isEmpty(customerPhone)){
      return {messege: "Điện thoại liên hệ không được để trống"}
    };
    if(_.isEmpty(address)){
      return {messege: "Địa chỉ không được để trống"}
    };
    if(_.isEmpty(carts)){
      return {messege: "Không thể thực hiện giao dịch khi giỏ hàng trống"}
    };
    if(_.isEmpty(paymentMethod)){
      return {messege: "Phương thức thanh toán không được để trống"}
    };
    if(!_.isNumber(quantity)){
      return {messege: "Số lượng phải là số"}
    };
    if(!_.isNumber(total)){
      return {messege: "Tổng tiền không được để trống"}
    }
  }
});
