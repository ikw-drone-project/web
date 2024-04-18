// server.js
// 필요한 모듈을 불러옵니다.
const express = require('express');
const mysql = require('mysql');
const path = require('path');

// Express 애플리케이션을 생성합니다.
const app = express();
const port = 3003;

// 정적 파일을 제공하기 위한 경로 설정
const buildPath = path.join(__dirname, 'map/build');
app.use(express.static(buildPath));

// 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: '127.0.0.1',    // 데이터베이스 호스트 주소
  port: '',          // MySQL 서버의 포트 번호
  user: 'root',          // 사용자 이름
  password: '', // 비밀번호
  database: ''      // 데이터베이스 이름
});

// 데이터베이스에 연결합니다.
connection.connect(err => {
  if (err) {
    return console.error('연결 실패: ' + err.message);
  }
  console.log('MySQL 데이터베이스에 연결됨!');
});

// 위치 데이터를 제공하는 API 경로를 설정합니다.
app.get('/drone-data', (req, res) => {
  connection.query('SELECT * FROM location', (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database query failed');
    } else {
      // 쿼리 결과를 JSON 형태로 응답합니다.
      res.json(results);
    }
  });
});

// 루트 경로에 대한 GET 요청 처리
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 서버를 포트에서 실행합니다.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 서버가 종료될 때 데이터베이스 연결을 종료합니다.
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) {
      console.error('Failed to close MySQL connection', err);
    }
    console.log('MySQL connection closed.');
    process.exit();
  });
});
