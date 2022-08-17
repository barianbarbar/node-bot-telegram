const sql = require("mssql");

const DBConfig = {
  port: 1433,
  user: "sa",
  server: '192.168.0.193',
  password: "12341234",
  database: "bot_telegram",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

const getConnection = async () => {
  try {
    const pool = await sql.connect(DBConfig);
    return pool;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getConnection, sql }