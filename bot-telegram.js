const { Telegraf } = require("telegraf");
const bot = new Telegraf("5457077782:AAH_hrn_wjUcTNuOz4XbIG5tZ6NkEcbZ-PA");

const { msg, confInlineKeyboard} = require("./data/pesan");
const { getConnection, sql } = require("./database/connection");
const { DataPelayanan } = require("./data/pelayanan");

let idPemintaBantuan;
const idGroup = -1001708087010;


// handle bot command /start
bot.command("start", async (ctx) => {
  idPemintaBantuan = ctx.chat.id;
  await bot.telegram.sendMessage(idPemintaBantuan, msg.salamPembuka, confInlineKeyboard.start);
});

// handle bot command /bantuan
bot.command("/bantuan", async (ctx) => {
  DataPelayanan.nama = `${ctx.chat.first_name} ${ctx.chat.last_name}`;
  await bot.telegram.sendMessage(idPemintaBantuan, msg.jenisLayanan, confInlineKeyboard.jenisLayanan);
});

// Function handle callback action dari inline keyboard jenis layanan
const actionJenisLayanan = (callbk_data, text) => {
  DataPelayanan.jenis = text;
  bot.action(callbk_data, async (ctx) => {
    await bot.telegram.sendMessage(idPemintaBantuan, msg.divisi, confInlineKeyboard.divisi);
  });
};

// Looping semua data pada inline keyboard layanan dan run function diatas
const { jenisLayanan: { reply_markup: replyMarkupJenisLayanan } } = confInlineKeyboard;
const { inline_keyboard: dataJenisLayanan } = JSON.parse(replyMarkupJenisLayanan);
dataJenisLayanan[0].forEach((jnsLayanan) => {
  // Run Function handle callback action, isi param dengan callback_data, text 
  actionJenisLayanan(jnsLayanan.callback_data, jnsLayanan.text);
});

// Function handle callback action dari inline keyboard divisi
const actionDivisi = (callbk_data, text) => {
  DataPelayanan.divisi = text;
  bot.action(callbk_data, async (ctx) => {
    await bot.telegram.sendMessage(idPemintaBantuan, msg.rincian);
  });
};

// Looping semua data pada inline keyboard divisi dan run function diatas
const { divisi: { reply_markup: replyMarkupDivisi } } = confInlineKeyboard;
const { inline_keyboard: dataDivisi } = JSON.parse(replyMarkupDivisi);
dataDivisi[0].forEach((dvs) => {
  // Run Function handle callback action, isi param dengan callback_data, text
  actionDivisi(dvs.callback_data, dvs.text);
});

// Handle bot command /rincian
bot.command("/rincian", async (ctx) => {
  
  // Get command text dan rincian bantuan yang dibutuhkan
  const commandAndMsg = ctx.update.message.text;
  const [,msgRincian] = commandAndMsg.split("#");

  DataPelayanan.keterangan = msgRincian;
  
  bot.telegram.sendMessage(idPemintaBantuan, msg.tunggu);
  
  // Message Untuk dikirim ke grup
  const data_permintaan = `Nama            : ${DataPelayanan.nama}\nJenis              : ${DataPelayanan.jenis}\nDivisi             : ${DataPelayanan.divisi}\nKeterangan : ${DataPelayanan.keterangan}`;
  
  // Send pesan ke grup untuk mendapatkan feedback 
  bot.telegram.sendMessage(idGroup, data_permintaan);
});

// Handle Bot command /siap
bot.command("/siap", async (ctx) => {

  const commandAndMsg = ctx.update.message.text;
  const [,msgPetugas] = commandAndMsg.split("#");

  // Get date
  const now = new Date();
  const dateToday = now.toLocaleDateString();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  
  // Set data untuk informasi pelayanan
  DataPelayanan.tanggal = dateToday;
  DataPelayanan.jam_mulai = `${hour}:${minutes}`;
  DataPelayanan.petugas = ctx.update.message.from.first_name;

  const infoPetugas = `Permintaan anda telah dikonfirmasi oleh ${DataPelayanan.petugas}`;

  await bot.telegram.sendMessage(idPemintaBantuan, infoPetugas);
  await bot.telegram.sendMessage(idPemintaBantuan, msgPetugas);
});

// Handle Command /selesai 
bot.command("selesai", async (ctx) => {

  // Get date
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  DataPelayanan.jam_selesai = `${hour}:${minutes}`;
  DataPelayanan.status = "Selesai";

  const pool = await getConnection();
  await pool.request()
  .input("jenis_layanan", sql.VarChar, DataPelayanan.jenis)
  .input("divisi", sql.VarChar, DataPelayanan.divisi)
  .input("nama_peminta", sql.VarChar, DataPelayanan.nama)
  .input("tanggal", sql.Date, DataPelayanan.tanggal)
  .input("waktu", sql.VarChar, `${DataPelayanan.jam_mulai} - ${DataPelayanan.jam_mulai}`)
  .input("layanan", sql.Text, DataPelayanan.keterangan)
  .input("status", sql.VarChar, DataPelayanan.status)
  .input("petugas", sql.VarChar, DataPelayanan.petugas)
  .query("INSERT INTO data_permintaan VALUES (@jenis_layanan, @divisi, @nama_peminta, @tanggal, @waktu, @layanan, @status, @petugas)");

  bot.telegram.sendMessage(idPemintaBantuan, msg.salamPenutup);
});

bot.launch();
