exports.msg = {
  salamPembuka: "Selamat datang dibot IT Support\napa yang bisa kami bantu hari ini?",
  jenisLayanan: "Sebelumnya jenis bantuan yang anda butuhkan seperti apa ya?",
  divisi: "Silahkan pilih divisi anda...\nAgar kami bisa dengan cepat datang ke TKP...",
  rincian: "Silahkan jelaskan bantuan yang anda butuhkan...\nformatnya seperti ini /rincian#bantuan...",
  tunggu: "Ditunggu sebentar... permintaan anda sedang menuggu konfirmasi... :)",
  salamPenutup: "Terima Kasih telah menggunakan BOT SUPPORT kami... :)",
};

exports.confInlineKeyboard = {
  start: {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [
        [{text: "/bantuan"}]
      ]
    })
  },
  jenisLayanan:{
    reply_markup: JSON.stringify({
      inline_keyboard:[
        [
          { text: "Pengecekan", callback_data: "service" },
          { text: "Hardware", callback_data: "service" },
          { text: "Software", callback_data: "service" },
          { text: "Network", callback_data: "service" },
        ],
      ],
    })
  },
  divisi:{
    reply_markup: JSON.stringify({
      inline_keyboard:[
        [
          {text: "SS", callback_data: "divisi"},
          {text: "CS", callback_data: "divisi"},
          {text: "SBM", callback_data: "divisi"},
        ]
      ],
    })
  },
};
