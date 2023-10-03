const { isNumber } = require("lodash");
const { isString } = require("lodash");
const { isArray } = require("lodash");
const { isEmpty } = require("lodash");
const _ = require("lodash");
const api = require("../../../../config/api");
module.exports = ({ strapi }) => ({
  async get_list({ type, name, code }) {
    //==== Lấy danh sách quần áo theo dữ liệu đầu vào (loại, tên, mã) ====
    let paramsArray = [];

    if (type) {
      const typeList = await strapi.db.query("api::type.type").findOne({
        where: {
          code: type,
        },
      });
      if (typeList) {
        paramsArray.push({ type: typeList.id });
      }
    }
    if (name) {
      paramsArray.push({ name });
    }
    if (code) {
      paramsArray.push({ code });
    }
    try {
      const list = await strapi.db.query("api::clothe.clothe").findMany({
        where: {
          $and: paramsArray,
        },
        populate: {
          color: true,
          size: true,
        },
      });
      return list;
    } catch (error) {
      console.log(error);
    }
  },

  async create_list({ name, code, price, description, size, color }) {
    // ==== Tạo sản phẩm quần áo mới ===
    if (isEmpty(size) && isEmpty(color)) {
      return { messege: "Thiếu dữ liệu đầu vào !" };
    }
    if (!isArray(color) || !isArray(size)) {
      return { messege: "Kiểu dữ liệu cho màu và kích cỡ phải là mảng" };
    }
    if (isNumber(name) && name) {
      return { messege: "Tên phải là chữ" };
    }
    if (isNumber(code) && code) {
      return { messege: "Mã phải là chữ" };
    }
    if (isString(code) && code) {
      const checkCode = await strapi.db.query("api::clothe.clothe").findMany({
        where: {
          code: code,
        },
      });
      if (checkCode) {
        return { messege: "Mã sản phẩm đã tồn tại" };
      }
    }
    if (!isNumber(price) && price) {
      return { messege: "giá tiền phải là số" };
    }
    if (!isString(description) && description) {
      return { messege: "Miêu tả phải là chữ" };
    }
    try {
      const entry = await strapi.entityService.create("api::clothe.clothe", {
        data: {
          name: name,
          code: code,
          color: color,
          description: description,
          size: size,
          price: price,
        },
        populate: {
          color: true,
          size: true,
        },
      });
      return entry;
    } catch (error) {
      console.log(error);
    }
  },

  async remove_list({ name, code }) {
    // === Xóa sản phẩm quần áo theo dữ liệu từ body (tên || loại) ===
    let deleteParams = [];
    if (name && isString(name)) {
      deleteParams.push({ name });
    }

    if (code && isString(code)) {
      deleteParams.push({ code });
    }

    try {
      const list = await strapi.db.query("api::clothe.clothe").findMany({
        where: {
          $and: deleteParams,
        },
      });
      if (list) {
        const removeList = await strapi.db.query("api::clothe.clothe").delete({
          where: {
            $and: deleteParams,
          },
        });
        return removeList;
      }
    } catch (error) {}
  },

  async update_list({ name, code, type, price, description, size, color }) {
    // === Cập nhật lại dữ liệu sản phẩm ===
    if (isEmpty(size) && isEmpty(color)) {
      return { messege: "Thiếu dữ liệu đầu vào !" };
    }
    if (!isArray(color) || !isArray(size)) {
      return { messege: "Kiểu dữ liệu cho màu và kích cỡ phải là mảng" };
    }
    if(color && isArray(color)){
        color.map((dt) => {
            if(!dt.name || !dt.code){
                return {messege: "Bảng màu phải đầy đủ tên và mã"}
            }
            if(!isString(dt.name)){
                return {messege: "Tên màu phải là chữ"}
            }
            if(!isString(code)){
                return {messege: "Mã màu phải là chữ"}
            }
        })
    }
    if(size && isArray(size)){
        size.map((dt) => {
            if(!dt.name || !dt.quantity){
                return {messege: "Bảng Size phải đầy đủ tên và số lượng"}
            }
            if(!isString(dt.name)){
                return {messege: "Tên size phải là chữ"}
            }
            if(!isNumber(dt.quantity)){
                return {messege: "Số lượng phải là số"}
            }
        })
    }
    if (isNumber(name) && name) {
      return { messege: "Tên phải là chữ" };
    }
    if (isNumber(code) && code) {
      return { messege: "Mã phải là chữ" };
    }
    if (isString(code) && code) {
      const checkCode = await strapi.db.query("api::clothe.clothe").findMany({
        where: {
          code: code,
        },
      });
      if (!checkCode) {
        return { messege: "Mã sản phẩm không tồn tại" };
      }
    }
    if (!isNumber(price) && price) {
      return { messege: "giá tiền phải là số" };
    }
    if (!isString(description) && description) {
      return { messege: "Miêu tả phải là chữ" };
    }
    try {
      const findId = await strapi.db.query("api::clothe.clothe").findOne({
        where:{
            code: code
        }
      });
      const id = _.get(findId, "id");
      if (id) {
        const updateList = await strapi.entityService.update(
          "api::clothe.clothe",
          id,
          {
            data: {
              name: name,
              color: color,
              description: description,
              size: size,
              price: price,
            },
            populate: {
              color: true,
              size: true,
            },
          }
        );
        return updateList;
      }
    } catch (error) {
      console.log(error);
    }
  },
});
