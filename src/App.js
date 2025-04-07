import React, { useState,useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import SakeHistory from './components/SakeHistory';
import RemoteSakeHistory from './components/RemoteSakeHistory';

// FastAPI
const API_BASE = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [history, setHistory] = useState([]);
  const [remoteHistory, setRemoteHistory] = useState([]);

  const fetchRemoteHistory = () => {
    fetch(`${API_BASE}/history`)
      .then((res) => res.json())
      .then((data) => setRemoteHistory(data))
      .catch((err) => console.error("履歴取得に失敗:", err));
  };
  
  useEffect(() => {
    fetchRemoteHistory();  // 初回だけ取得
  }, []);

  return (
    <div className="App">
      <h1>日本酒検索アプリ</h1>
      <ImageUpload setHistory={setHistory} onRemoteUpdate={fetchRemoteHistory} />
      <SakeHistory history={history} />

      <hr />
      <RemoteSakeHistory history={remoteHistory} />
    </div>
  );
}

export default App;
