import { useCallback, useEffect, useState } from 'react';
import ReactDOM, { unstable_batchedUpdates } from 'react-dom';
import { Editor } from './Editor';

interface fileObj {
  [key: string]: string;
}

const filesName = ['/app.js', '/cc.js'];

const App = () => {
  const [value, setValue] = useState('');
  const [path, setPath] = useState('');
  const [files, setFiles] = useState<fileObj>({});

  useEffect(() => {
    const promises = filesName.map(
      async (v) => await (await fetch(`/files${v}`)).text()
    );

    console.log('promises', promises);

    Promise.all(promises).then((filesContent) => {
      const res: fileObj = {};
      filesContent.forEach((content, index) => {
        res[filesName[index]] = content;
      });
      unstable_batchedUpdates(() => {
        setFiles(res);
        setPath(filesName[0]);
        setValue(filesContent[0]);
      });
    });
  }, []);

  const handleChangeValue = (item: string) => {
    setPath(item);
    setValue(files[item]);
  };

  const handleChange = useCallback(
    (value) => {
      setValue(value);
      console.log('r');

      setFiles((pre) => ({
        ...pre,
        [path]: value,
      }));
    },
    [path]
  );
  return (
    <div>
      {filesName.map((item) => (
        <li key={item} onClick={() => handleChangeValue(item)}>
          {item}
        </li>
      ))}
      {Object.keys(files).length > 0 && (
        <Editor
          value={value}
          path={path}
          files={files}
          options={{ fontSize: 14, automaticLayout: true }}
          language='javascript'
          onValueChange={handleChange}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
