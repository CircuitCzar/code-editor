import { FC, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface fileObj {
  [key: string]: string;
}

interface EditorProps {
  options: monaco.editor.IStandaloneEditorConstructionOptions;
  value: string;
  language: string;
  path: string;
  files: fileObj;
  onValueChange: (v: string) => void;
}

function initializeFile(path: string, value: string) {
  console.log('path', monaco.editor.getModels());

  // 获取所有创建的模型。
  let model = monaco.editor
    .getModels()
    .find((model) => model.uri.path === path);

  if (model) {
    if (model.getValue() !== value) {
      model.pushEditOperations(
        [],
        [{ range: model!.getFullModelRange(), text: value }],
        () => []
      );
    }
  } else {
    monaco.editor.createModel(
      value,
      'javascript',
      new monaco.Uri().with({ path })
    );
  }
}

const Editor: FC<EditorProps> = ({
  options,
  language,
  files,
  path,
  value,
  onValueChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 创建编辑器
    editorRef.current = monaco.editor.create(editorNodeRef.current!, options);
    // 销毁组件
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    Object.keys(files).forEach((key) => initializeFile(key, files[key]));
  }, [files]);

  useEffect(() => {
    initializeFile(path, value);
    const model = monaco.editor
      .getModels()
      .find((model) => model.uri.path === path);
    let sub: monaco.IDisposable;
    if (model && editorRef.current) {
      editorRef.current.setModel(model);
      sub = editorRef.current.getModel()!.onDidChangeContent(() => {
        const v = editorRef.current!.getModel()!.getValue();
        onValueChange(v);
      });
    }
    return () => {
      if (sub.dispose) {
        sub.dispose();
      }
    };
  }, [path, value]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(options);
    }
  }, [options]);

  return (
    <div ref={editorNodeRef} style={{ width: '800px', height: '600px' }}></div>
  );
};

export { Editor };
