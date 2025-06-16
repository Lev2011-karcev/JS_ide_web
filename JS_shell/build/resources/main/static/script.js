// Загружаем редактор Monaco
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.33.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
  window.editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: `console.log("Добро пожаловать в JS Shell");\nlet a = 2 + 2;\nconsole.log("a =", a);`,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    automaticLayout: true,
    minimap: { enabled: false }
  });
});

// Получаем элементы
const terminal = document.getElementById("terminal");
const runButton = document.getElementById("run-button");
document.getElementById("clear-button").addEventListener("click", clearTerminal);

// Очищаем терминал
function clearTerminal() {
  terminal.textContent = "";
}

// Кнопка запуска
runButton.addEventListener("click", () => {
  clearTerminal();

  const originalConsoleLog = console.log;

  // Перехватываем console.log
  console.log = function (...args) {
    terminal.textContent += args.join(" ") + "\n";
    originalConsoleLog.apply(console, args);
  };

  try {
    const code = window.editor.getValue();
    const result = eval(code);

    // Если выражение вернуло что-то кроме undefined — тоже покажем
    if (result !== undefined) {
      terminal.textContent += "> " + result + "\n";
    }

  } catch (err) {
    terminal.textContent += "Ошибка: " + err.message + "\n";
  }

  // Восстанавливаем оригинальный console.log
  console.log = originalConsoleLog;
});
