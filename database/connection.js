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

const hitToDB = async () => {
  try {
    const pool = await getConnection();
    await pool.request()
    .input("jenis_layanan", sql.VarChar, "Hardware")
    .input("divisi", sql.VarChar, "SS")
    .input("nama_peminta", "Radea")
    .input("tanggal", sql.Date, "8/14/2022")
    .input("waktu", sql.VarChar, "8:35 - 8:46")
    .input("layanan", sql.Text, "Perbaikan PC")
    .input("status", sql.VarChar, "Selesai")
    .input("petugas", sql.VarChar, "Radea")
    .query("INSERT INTO data_permintaan VALUES (@jenis_layanan, @divisi, @nama_peminta, @tanggal, @waktu, @layanan, @status, @petugas)");
  } catch (error) {
    console.log(error);
  }
}

hitToDB();


module.exports = { getConnection, sql }