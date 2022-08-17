const { getConnection, sql } = require("../database/connection");

exports.getAllData = async (req, res) => {

  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM data_permintaan");

  res.render("index", { datas: result.recordset });
  // res.send(result);
};

exports.convertDataToExcel = async (req, res) => {  

  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM data_permintaan");

  const xl = require("excel4node");
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("Testing");

  const data = result.recordset;
  const dataForExcel = [];

  const getDate = (datetime) => { 
    const date = new Date(datetime); 
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; 
    return date.toLocaleString('en-GB', options);
  };

  const getToday = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; 
    return today.toLocaleString('en-GB', options).split("/").join("");
  }

  data.forEach((dt) => {
    const names = Object.keys(dt)
    .filter((key) => !key.includes("id"))
    .reduce((obj, key) => {
        if (key === "tanggal") {
          return Object.assign(obj, {
            [key]: getDate(dt[key])
          });
        }
        return Object.assign(obj, {
          [key]: dt[key]
        });
    }, {});
    dataForExcel.push(names);
  });

  const headingColumnNames = [
    "Jenis Request",
    "Dept dan No Unit",
    "Request By",
    "Tanggal",
    "Waktu",
    "Service",
    "Keterangan",
    "Staff Support",
  ];

  let headingColumnIndex = 1;

  headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++).string(heading).style({
      alignment: {
        wrapText: true,
        horizontal: "center",
        vertical: "center",
      },
      border: {
        left: {
          style: "thin",
          color: "#000000", 
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid", 
        fgColor: "#FFF800", 
      } 
    });
  });

  let rowIndex = 2;

  dataForExcel.forEach( record => {
    let columnIndex = 1;
    Object.keys(record).forEach(columnName => {
      ws.cell(rowIndex, columnIndex++).string(String(record[columnName])).style({
        alignment: {
          wrapText: true,
          horizontal: "left",
          vertical: "center",
        },
        border: {
          left: {
            style: "thin",
            color: "#000000", 
          },
          right: {
            style: "thin",
            color: "#000000",
          },
          top: {
            style: "thin",
            color: "#000000",
          },
          bottom: {
            style: "thin",
            color: "#000000",
          },
        }
      });
    });
    rowIndex++;
  });

  // Column Jenis
  ws.column(1).setWidth(20);
  // Column Divisi
  ws.column(2).setWidth(15);
  // Column Req
  ws.column(3).setWidth(18);
  // Column Tanggal
  ws.column(4).setWidth(12);
  // Column Waktu
  ws.column(5).setWidth(12);
  // Column Service
  ws.column(6).setWidth(100);
  // Column Ket
  ws.column(7).setWidth(10);
  // Column Staff
  ws.column(8).setWidth(10);

  wb.write(`Helpdesk${getToday()}.xlsx`, res);
};

exports.pageEditData = async (req, res) => {
  const { idData } = req.params;

  const pool = await getConnection();
  const result = await pool.request().query(`SELECT * FROM data_permintaan WHERE id=${idData}`);

  res.render("edit", { data: result.recordset });
};

exports.editDataById = async (req, res) => {
  const { idData } = req.params;

  const {
    jenis,
    divisi,
    requestby,
    tanggal,
    waktu,
    service,
    keterangan,
    staff,
  } = req.body;

  const pool = await getConnection();
  await pool.request()
  .input("jenis_layanan", sql.VarChar, jenis)
  .input("divisi", sql.VarChar, divisi)
  .input("nama_peminta", sql.VarChar, requestby)
  .input("tanggal", sql.Date, tanggal)
  .input("waktu", sql.VarChar, waktu)
  .input("layanan", sql.Text, service)
  .input("status", sql.VarChar, keterangan)
  .input("petugas", sql.VarChar, staff)
  .input("id", idData)
  .query("UPDATE data_permintaan SET jenis_layanan = @jenis_layanan, divisi = @divisi, nama_peminta = @nama_peminta, tanggal = @tanggal, waktu = @waktu, layanan = @layanan, status = @status, petugas = @petugas WHERE id = @id");

  res.redirect("/");
};

exports.deleteDataById = async (req, res) => {
  const { idData } = req.params;

  const pool = await getConnection();
  await pool.request().query(`DELETE FROM data_permintaan WHERE id=${idData}`);

  res.redirect("/");
};