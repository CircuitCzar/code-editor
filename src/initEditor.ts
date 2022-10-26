import * as monaco from 'monaco-editor';
import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

export const startUp = () => {
  // 初始化主题
  const init = async () => {
    await loadWASM('/onigasm.wasm');
    const onDarkProTheme = JSON.parse(
      await (await fetch('/themes/OneDarkPro.json')).text()
    );
    // 定义主题
    monaco.editor.defineTheme('OneDarkPro', onDarkProTheme);
    // 设置主题
    monaco.editor.setTheme('OneDarkPro');
  };
  init();

  // 语法提示
  const grammars = new Map();
  grammars.set('html', 'text.html.basic');
  grammars.set('css', 'source.css');
  grammars.set('scss', 'source.css.scss');
  grammars.set('javascript', 'source.js');
  grammars.set('javascriptreact', 'source.js.jsx');
  grammars.set('typescript', 'source.ts');
  grammars.set('typescriptreact', 'source.tsx');
  grammars.set('typescriptreact', 'source.tsx');

  // 创建一个注册表，可以从作用域名称来加载对应的语法文件
  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      const res = await (
        await fetch(`/Grammars/Javascript.tmLanguage.json`)
      ).text();
      return {
        format: 'json', // 语法文件格式，有json、plist
        content: res,
      };
    },
  });

  function wireMonacoGrammars() {
    wireTmGrammars(monaco, registry, grammars);
  }

  setTimeout(() => {
    wireMonacoGrammars();
  }, 3000);
};
