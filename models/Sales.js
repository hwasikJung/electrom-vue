import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Sales = sequelize.define('test_sales', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  department: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Sales;
