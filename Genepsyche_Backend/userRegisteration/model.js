const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // Sequelize instance (make sure it's configured)

class User extends Model {
  // Compare password method
  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_group: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,

    hooks: {
      // Hash password before create
      beforeCreate: async (user) => {
        const saltRounds = 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      },

      // Hash password before update (if modified)
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  }
);

module.exports = User;
