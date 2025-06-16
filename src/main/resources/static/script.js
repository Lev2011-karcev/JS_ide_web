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
const clearButton = document.getElementById("clear-button");
const resizer = document.getElementById("resizer");
const editor = document.getElementById("editor-container");

clearButton.addEventListener("click", clearTerminal);

// Очищаем терминал
function clearTerminal() {
  terminal.textContent = "";
}

// Запуск кода
runButton.addEventListener("click", () => {
  clearTerminal();

  const originalConsoleLog = console.log;

  console.log = function (...args) {
    terminal.textContent += args.join(" ") + "\n";
    terminal.scrollTop = terminal.scrollHeight; // автоскролл вниз
    originalConsoleLog.apply(console, args);
  };

  try {
    const code = window.editor.getValue();
    const result = eval(code);

    if (result !== undefined) {
      terminal.textContent += "> " + result + "\n";
      terminal.scrollTop = terminal.scrollHeight;
    }

  } catch (err) {
    terminal.textContent += "Ошибка: " + err.message + "\n";
    terminal.scrollTop = terminal.scrollHeight;
  }

  console.log = originalConsoleLog;
});

// Логика перетягивания ресайзера
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.body.style.userSelect = 'none'; // отключаем выделение текста при ресайзе
});

document.addEventListener('mouseup', (e) => {
  if (isResizing) {
    isResizing = false;
    document.body.style.userSelect = ''; // включаем выделение обратно
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;

  const containerWidth = resizer.parentElement.clientWidth;

  let newEditorWidth = e.clientX;
  if (newEditorWidth < 100) newEditorWidth = 100;
  if (newEditorWidth > containerWidth - 100) newEditorWidth = containerWidth - 100;

  editor.style.width = newEditorWidth + 'px';
  terminal.style.width = (containerWidth - newEditorWidth - resizer.offsetWidth) + 'px';
});
