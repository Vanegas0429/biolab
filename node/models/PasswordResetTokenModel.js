import db from "../database/db.js";
import { DataTypes } from "sequelize";

const PasswordResetTokenModel = db.define("password_reset_tokens", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token_hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  requested_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default PasswordResetTokenModel;
