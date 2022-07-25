import { useState, useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

const html = `
     <html>
     <body>
        <div id="root">
        <script>
            window.addEventListener('message', (event)=> {
              try{
                eval(event.data)

              }catch(err){
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color:red">' + err + '</div>'
                throw err

              }

            }, false)
        </script>
        </div>
     </body>
     </html>
    `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);
  return (
    <iframe
      title="code preview"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;