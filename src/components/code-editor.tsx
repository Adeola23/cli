import './code-editor.css'
import Editor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const monacoRef = useRef<any>();
  const editorRef = useRef<any>();
  function handleEditorChange(value: any, event: any) {
    console.log('here is the current model value:', value);

    onChange(value);
  }
  function handleEditorDidMount(editor: any, monaco: any) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = editor;
  }

  const onFormatClick = () => {
    const unformatted = monacoRef.current.getModel().getValue();
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/, ''); // removes extra new line at the end 
    monacoRef.current.setValue(formatted);
    console.log(monacoRef.current);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        theme="vs-dark"
        language="javascript"
        height="500px"
        value={initialValue}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          wordWrap: 'on',
          tabSize: 2,
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
