const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const todos = [
	{ title: "brush teeth", id: uuidv4() },
	{ title: "do laundry", id: uuidv4() },
];
const headers = {
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, Content-Length, X-Requested-With",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
	"Content-Type": "application/json",
};

// 處理 CORS 預檢請求
router.use((req, res, next) => {
	if (req.method === "OPTIONS") {
		res.writeHead(200, headers);
		res.end();
	} else {
		next();
	}
});

// GET 請求 - 獲取所有待辦事項
router.get("/", (req, res) => {
	res.status(200).json({ status: "success", todos });
});

//POST請求-新增單筆資訊
router.post("/", (req, res) => {
	const todo = req.body.title;
	if (!todo || !typeof todo === "string" || todo.trim() == "") {
		res.status(400).json({
			status: "false",
			message: "請提供有效的待辦事項",
		});
	}
	const newTodo = { title: todo.trim(), id: uuidv4() };
	todos.push(newTodo);
	res.status(200).json({ status: "success", data: todos });
});

//DELETE 請求 - 刪除所有待辦事項
router.delete("/", (req, res) => {
	todos.length = 0;
	res.status(200).json({ status: "success", todos });
});

// DELETE 請求 - 刪除特定待辦事項
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	const index = todos.findIndex((item) => item.id === id);
	if (index === -1) {
		return res.status(404).json({
			status: "false",
			message: "找不到該待辦事項",
		});
	}
	todos.splice(index, 1);
	res.status(200).json({ status: "success", todos });
});

// PATCH 請求 - 更新待辦事項
router.patch("/:id", (req, res) => {
	const todo = req.body.title;
	const id = req.params.id;
	const index = todos.findIndex((item) => item.id === id);

	if (!todo || typeof todo !== "string" || todo.trim() === "" || index === -1) {
		return res.status(400).json({
			status: "false",
			message: "請提供有效的 title",
		});
	}

	todos[index].title = todo.trim();
	res.status(200).json({ status: "success", todos });
});

module.exports = router;
