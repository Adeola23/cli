import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';

import reportWebVitals from './reportWebVitals';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      // loader: 'jsx', // telling esbuild what kind of code we are transpiling
      // target: 'es2015',
    });

    setCode(result.outputFiles[0].text);

    try {
      eval(result.outputFiles[0].text);
    } catch (error) {
      alert(error)
    }

    console.log(result);
  };
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <div>
        <pre>{code}</pre>
        <iframe src="/test.html"></iframe>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
