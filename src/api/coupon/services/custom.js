const { isString, isArray, isEmpty } = require("lodash");

module.exports = ({ strapi }) => ({
  async get_list({ name, code }) {
    let paramsArray = [];
    if (name) {
      paramsArray.push({ name });
    }
    if (code) {
      paramsArray.push({ code });
    }
    try {
      const list = await strapi.db.query("api::coupon.coupon").findMany({
        where: {
          $and: paramsArray,
        },
      });
      return list;
    } catch (error) {
      return error;
    }
  },

  async add_coupon({ name, code, clothes }) {
    if (!code && !name) {
      return { messege: "Thiếu thông tin tên hoặc mã !" };
    }
    if (!isEmpty(clothes)) {
      return { messege: "Danh sách quần áo phải là mảng !" };
    }

    try {
      const findClothes = await strapi.db.query("api::clothe.clothe").findOne({
        where: {
          code: clothes,
        },
      });
      if (!findClothes) {
        return { messege: "Không tìm thấy quần áo !" };
      }
      const new_coupon = await strapi.db.query("api::coupon.coupon").create({
        data: {
          name: name,
          code: code,
          clothes: findClothes.id,
        },
        populate: {
          clothes: true,
        },
      });
      if(!new_coupon){
        return {messege: "Thông tin tạo thiếu hoặc sai !"}
      }
      return new_coupon;
    } catch (error) {
      console.log(error);
    }
  },
});
