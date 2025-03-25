// API URL：連接到後端伺服器的 API
const API_URL = "https://project-space.onrender.com/todos";

// 取得前端 DOM 元素
const todoInput = document.getElementById("to-do-input");
const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const todoList = document.getElementById("to-do-list");

// 渲染待辦事項列表
function renderTodos(todos) {
	todoList.innerHTML = ""; // 清空目前的列表內容
	todos.forEach((todo) => {
		// 為每個待辦事項創建一個 <li> 元素
		const li = document.createElement("li");
		li.innerHTML = `
            <span>${todo.title}</span> <!-- 顯示待辦事項標題 -->
            <div class="btn-group">
                <button class="editBtn" onclick="editTodo('${todo.id}', '${todo.title}')">編輯</button>
                <button class="deleteBtn" onclick="deleteTodo('${todo.id}')">刪除</button>
            </div>
        `;
		todoList.appendChild(li); // 把每個待辦事項加入到列表中
	});
}

// 載入所有待辦事項（GET）
async function fetchTodos() {
	try {
		// 發送 GET 請求來取得待辦事項
		const response = await fetch(API_URL);
		const data = await response.json();
		renderTodos(data.todos); // 將取得的待辦事項渲染到頁面上
	} catch (error) {
		console.error("載入失敗", error); // 如果請求失敗，顯示錯誤訊息
	}
}

// 新增待辦事項（POST）
addBtn.addEventListener("click", async () => {
	const title = todoInput.value.trim(); // 獲取輸入框的值
	console.log("輸入的值: ", title); // 檢查輸入框的值
	if (title === "") return alert("請輸入內容"); // 如果沒有輸入內容，提醒用戶

	try {
		// 發送 POST 請求來新增待辦事項
		await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title }), // 將標題傳遞給後端
		});
		todoInput.value = ""; // 清空輸入框
		fetchTodos(); // 重新載入待辦事項列表
	} catch (error) {
		console.error("新增失敗", error); // 如果新增失敗，顯示錯誤訊息
	}
});
// 刪除單個待辦事項（DELETE）
async function deleteTodo(id) {
	try {
		// 發送 DELETE 請求來刪除特定的待辦事項
		await fetch(`${API_URL}/${id}`, { method: "DELETE" });
		fetchTodos(); // 刪除後重新載入待辦事項列表
	} catch (error) {
		console.error("刪除失敗", error); // 如果刪除失敗，顯示錯誤訊息
	}
}

// 清空所有待辦事項（DELETE）
clearAllBtn.addEventListener("click", async () => {
	try {
		// 發送 DELETE 請求來清空所有待辦事項
		await fetch(API_URL, { method: "DELETE" });
		fetchTodos(); // 清空後重新載入待辦事項列表
	} catch (error) {
		console.error("清空失敗", error); // 如果清空失敗，顯示錯誤訊息
	}
});

// 編輯待辦事項（PATCH）
async function editTodo(id, oldTitle) {
	const newTitle = prompt("請輸入新的待辦事項", oldTitle); // 提示用戶輸入新的標題
	if (!newTitle || newTitle.trim() === "") return; // 如果沒有輸入內容，直接返回

	try {
		// 發送 PATCH 請求來更新待辦事項
		await fetch(`${API_URL}/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: newTitle }), // 將新的標題傳遞給後端
		});
		fetchTodos(); // 更新後重新載入待辦事項列表
	} catch (error) {
		console.error("編輯失敗", error); // 如果編輯失敗，顯示錯誤訊息
	}
}

// 頁面載入時呼叫 API 來取得待辦事項
fetchTodos();
