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

export default pool;