import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import Home from "./page";

describe("Home (Todo アプリ)", () => {
  // ----------------------------------------------------------------
  // 初期表示
  // ----------------------------------------------------------------
  describe("初期表示", () => {
    it("タイトルが表示される", () => {
      render(<Home />);
      expect(screen.getByText("Todo アプリ")).toBeInTheDocument();
    });

    it("入力フィールドが表示される", () => {
      render(<Home />);
      expect(
        screen.getByPlaceholderText("新しいタスクを入力...")
      ).toBeInTheDocument();
    });

    it("「追加」ボタンが表示される", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
    });

    it("優先度ボタンが3つ表示される", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "高優先度" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "中優先度" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "低優先度" })).toBeInTheDocument();
    });

    it("フィルターボタンが3つ表示される", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "すべて" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "未完了" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "完了済み" })).toBeInTheDocument();
    });

    it("Todoが0件のとき「タスクがありません」と表示される", () => {
      render(<Home />);
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("Todoが0件のときフッターが表示されない", () => {
      render(<Home />);
      expect(screen.queryByText(/残り/)).not.toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // Todo の追加
  // ----------------------------------------------------------------
  describe("Todo の追加", () => {
    it("「追加」ボタンでTodoを追加できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "テストタスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("テストタスク")).toBeInTheDocument();
    });

    it("Enter キーでTodoを追加できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "Enterで追加{Enter}"
      );

      expect(screen.getByText("Enterで追加")).toBeInTheDocument();
    });

    it("追加後に入力フィールドがクリアされる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(input).toHaveValue("");
    });

    it("空文字のTodoは追加されない", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("スペースのみのTodoは追加されない", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "   "
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("複数のTodoを追加できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.type(input, "タスク2");
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // 優先度
  // ----------------------------------------------------------------
  describe("優先度", () => {
    it("デフォルトの優先度は「中」", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      // 「中」ラベルが表示されていること
      const todoItems = screen.getAllByText("中");
      expect(todoItems.length).toBeGreaterThan(0);
    });

    it("優先度「高」を選択してTodoを追加すると「高」ラベルが表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.click(screen.getByRole("button", { name: "高優先度" }));
      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "高優先タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("高")).toBeInTheDocument();
    });

    it("優先度「低」を選択してTodoを追加すると「低」ラベルが表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.click(screen.getByRole("button", { name: "低優先度" }));
      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "低優先タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("低")).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // Todo の完了/未完了 切り替え
  // ----------------------------------------------------------------
  describe("Todo の完了/未完了 切り替え", () => {
    it("チェックボックスで完了にできる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "完了テスト"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("チェックボックスで完了→未完了に戻せる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "トグルテスト"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  // ----------------------------------------------------------------
  // Todo の削除
  // ----------------------------------------------------------------
  describe("Todo の削除", () => {
    it("削除ボタンでTodoを削除できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "削除対象"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("削除対象")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "削除" }));

      expect(screen.queryByText("削除対象")).not.toBeInTheDocument();
    });

    it("複数Todoのうち1件だけ削除できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "残すタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.type(input, "削除するタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));

      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[1]);

      expect(screen.getByText("残すタスク")).toBeInTheDocument();
      expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // Todo の編集
  // ----------------------------------------------------------------
  describe("Todo の編集", () => {
    beforeEach(async () => {});

    it("編集ボタンでインライン編集モードになる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "編集対象"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("button", { name: "編集" }));

      // 編集用inputが表示される
      const editInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el !== screen.getByPlaceholderText("新しいタスクを入力..."));
      expect(editInputs.length).toBe(1);
    });

    it("Enterキーで編集内容を保存できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "元のテキスト"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("button", { name: "編集" }));

      const editInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el !== screen.getByPlaceholderText("新しいタスクを入力..."));
      await user.clear(editInputs[0]);
      await user.type(editInputs[0], "変更後のテキスト{Enter}");

      expect(screen.getByText("変更後のテキスト")).toBeInTheDocument();
      expect(screen.queryByText("元のテキスト")).not.toBeInTheDocument();
    });

    it("Escapeキーで編集をキャンセルできる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "キャンセルテスト"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("button", { name: "編集" }));

      const editInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el !== screen.getByPlaceholderText("新しいタスクを入力..."));
      await user.clear(editInputs[0]);
      await user.type(editInputs[0], "変更途中{Escape}");

      expect(screen.getByText("キャンセルテスト")).toBeInTheDocument();
    });

    it("フォーカスを外すと編集内容が保存される (blur)", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "blur保存テスト"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("button", { name: "編集" }));

      const editInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el !== screen.getByPlaceholderText("新しいタスクを入力..."));
      await user.clear(editInputs[0]);
      await user.type(editInputs[0], "blur後のテキスト");
      fireEvent.blur(editInputs[0]);

      expect(screen.getByText("blur後のテキスト")).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // フィルター
  // ----------------------------------------------------------------
  describe("フィルター", () => {
    async function setupTodos() {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "未完了タスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.type(input, "完了タスク");
      await user.click(screen.getByRole("button", { name: "追加" }));

      // 2番目のcheckboxをチェック
      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]);

      return user;
    }

    it("「すべて」フィルターで全Todoが表示される", async () => {
      await setupTodos();

      await userEvent.setup().click(screen.getByRole("button", { name: "すべて" }));

      expect(screen.getByText("未完了タスク")).toBeInTheDocument();
      expect(screen.getByText("完了タスク")).toBeInTheDocument();
    });

    it("「未完了」フィルターで未完了のTodoのみ表示される", async () => {
      const user = await setupTodos();

      await user.click(screen.getByRole("button", { name: "未完了" }));

      expect(screen.getByText("未完了タスク")).toBeInTheDocument();
      expect(screen.queryByText("完了タスク")).not.toBeInTheDocument();
    });

    it("「完了済み」フィルターで完了したTodoのみ表示される", async () => {
      const user = await setupTodos();

      await user.click(screen.getByRole("button", { name: "完了済み" }));

      expect(screen.queryByText("未完了タスク")).not.toBeInTheDocument();
      expect(screen.getByText("完了タスク")).toBeInTheDocument();
    });

    it("該当Todoがない場合「タスクがありません」が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "未完了タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      await user.click(screen.getByRole("button", { name: "完了済み" }));

      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // フッター (カウント・完了済み削除)
  // ----------------------------------------------------------------
  describe("フッター", () => {
    it("Todoを追加すると残り件数が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "タスク1"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("残り 1 件")).toBeInTheDocument();
    });

    it("完了済みのTodoがあると「完了済みを削除」ボタンが表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("checkbox"));

      expect(screen.getByText(/完了済みを削除/)).toBeInTheDocument();
    });

    it("「完了済みを削除」で完了済みTodoがすべて削除される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "残すタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.type(input, "完了タスク");
      await user.click(screen.getByRole("button", { name: "追加" }));

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]);

      await user.click(screen.getByText(/完了済みを削除/));

      expect(screen.getByText("残すタスク")).toBeInTheDocument();
      expect(screen.queryByText("完了タスク")).not.toBeInTheDocument();
    });

    it("完了済みTodoがないとき「完了済みを削除」ボタンが表示されない", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(
        screen.getByPlaceholderText("新しいタスクを入力..."),
        "未完了タスク"
      );
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.queryByText(/完了済みを削除/)).not.toBeInTheDocument();
    });

    it("残り件数はTodoを完了にすると減る", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.type(input, "タスク2");
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText("残り 2 件")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(screen.getByText("残り 1 件")).toBeInTheDocument();
    });
  });
});
