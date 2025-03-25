const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// 引入路由模組
const router = require("./router");
app.use("/todos", router);
//錯誤處理middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send({ error: "伺服器錯誤" });
});

const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3005;
server.listen(port, () => {
	console.log(`伺服器已經啟動在 http://localhost:${port}`);
});
