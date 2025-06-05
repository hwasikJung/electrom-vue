import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || '223.195.131.15',
  port: parseInt(process.env.DB_PORT || '15432'),
  username: process.env.DB_USER || 'ibed_user01',
  password: process.env.DB_PASSWORD || 'Passw0rd',
  database: process.env.DB_NAME || 'ibedmst',
  define: {
    schema: process.env.DB_SCHEMA || 'sc_portal',
    timestamps: false, // 타임스탬프 필드 비활성화
    freezeTableName: true // 테이블 이름을 모델 이름 그대로 사용
  },
  logging: false
});

export default sequelize;
