import React,{useState} from 'react';
import ImageUpload from './components/ImageUpload';
import SakeHistory from './components/SakeHistory';

function App() {
  const [history, setHistory] = useState([]);
  return (
    <div>
      <h1>日本酒検索アプリ</h1>
      <ImageUpload setHistory={setHistory}/>
      <SakeHistory history={history} />
    </div>
  );
}

export default App;
