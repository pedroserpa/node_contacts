import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'recruitment.alfasoft.pt',
  user: 'pedroserpa-nodejs',
  password: 'XBWygmMqmasPgVk',
  database: 'pedroserpa-nodejs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/*
const pool = mysql.createPool({
  host: 'localhost',
  user: 'pedro',
  password: 'lord2004',
  database: 'pedroserpa-nodejs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});*/

export default pool;