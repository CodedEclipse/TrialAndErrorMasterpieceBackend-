var DataTypes = require("sequelize").DataTypes;
var _adm_role = require("./adm_role");
var _adm_user = require("./adm_user");

function initModels(sequelize) {
  var adm_role = _adm_role(sequelize, DataTypes);
  var adm_user = _adm_user(sequelize, DataTypes);

  adm_user.belongsTo(adm_role, { as: "role", foreignKey: "role_id"});
  adm_role.hasMany(adm_user, { as: "adm_users", foreignKey: "role_id"});

  return {
    adm_role,
    adm_user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
