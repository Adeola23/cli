import React from 'react';

import { useState } from 'react';
import bundle from '../bundler';

import CodeEditor from './code-editor';
import Preview from './preview';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const output = await bundle(input);

    setCode(output);
  };
  //event object coming from the parent property

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <div>
        <Preview code={code} />
      </div>
    </div>
  );
};


export default CodeCell
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
