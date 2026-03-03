"use client";

import { useState } from "react";

type Priority = "high" | "medium" | "low";
type Filter = "all" | "active" | "completed";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    const text = inputText.trim();
    if (!text) return;
    setTodos([
      ...todos,
      { id: Date.now(), text, completed: false, priority, createdAt: new Date() },
    ]);
    setInputText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    const text = editText.trim();
    if (!text) return;
    setTodos(todos.map((t) => (t.id === editingId ? { ...t, text } : t)));
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Todo アプリ
        </h1>

        {/* 入力フォーム */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="新しいタスクを入力..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={addTodo}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              追加
            </button>
          </div>
          <div className="flex gap-2">
            {(["high", "medium", "low"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`text-xs border rounded-full px-3 py-1 font-medium transition-all ${
                  PRIORITY_COLORS[p]
                } ${priority === p ? "ring-2 ring-offset-1 ring-indigo-400" : "opacity-60"}`}
              >
                {PRIORITY_LABELS[p]}優先度
              </button>
            ))}
          </div>
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-4 justify-center">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-500 hover:bg-indigo-50"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了済み"}
            </button>
          ))}
        </div>

        {/* Todoリスト */}
        <div className="space-y-2">
          {filteredTodos.length === 0 && (
            <div className="text-center text-gray-400 py-12 text-sm">
              タスクがありません
            </div>
          )}
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3 group transition-opacity ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer flex-shrink-0"
              />
              <span
                className={`text-xs border rounded-full px-2 py-0.5 font-medium flex-shrink-0 ${PRIORITY_COLORS[todo.priority]}`}
              >
                {PRIORITY_LABELS[todo.priority]}
              </span>
              {editingId === todo.id ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={saveEdit}
                  className="flex-1 border-b border-indigo-400 text-sm focus:outline-none"
                />
              ) : (
                <span
                  className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {todo.text}
                </span>
              )}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId !== todo.id && (
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-gray-400 hover:text-indigo-500 text-xs px-2 py-1 rounded"
                  >
                    編集
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 rounded"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        {todos.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-xs text-gray-400 px-1">
            <span>残り {activeCount} 件</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="hover:text-red-400 transition-colors"
              >
                完了済みを削除 ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
