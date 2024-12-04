const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('adm_user', {
    admin_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    unique_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    login_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    login_pass: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    login_pass_plain: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    state_lgd_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    district_lgd_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    sub_district_lgd_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    village_lgd_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    is_master: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    added_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    modify_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modify_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'adm_role',
        key: 'role_id'
      }
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    activate_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'adm_user',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "adm_user_pkey",
        unique: true,
        fields: [
          { name: "admin_id" },
        ]
      },
    ]
  });
};
