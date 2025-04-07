import React,{ useEffect, useState } from 'react';
import Papa from 'papaparse';

// FastAPI
const API_BASE = process.env.REACT_APP_API_BASE_URL;


const ImageUpload = ({setHistory,onRemoteUpdate}) => {
// useState
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null); // ← 認識結果を保存
  const [sakelist,setSakelist] = useState([]);//日本酒用のstateを追加
// useEffect
  useEffect(() => {
    fetch('/sake.csv') // ← ここでCSVファイルを読み込んで
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, { header: true }); // CSVをパースして
        setSakelist(result.data); // データを state に保存
      });
  }, []); // ← これが「最初の1回だけ実行するよ」の印！
  

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setResult(null); // 新しい画像選択時に結果リセット
    }
  };  

// イベント処理関数
  const handleUpload = async () => {
    if (!file) {
      alert('画像を選択してください');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('${API_BASE}/upload-image', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const responses = data.responses;
      if (
        !responses ||
        !responses[0] ||
        !responses[0].textAnnotations ||
        responses[0].textAnnotations.length === 0
      ) {
        setResult('文字が読み取れませんでした');
        return;
      }

      const text = responses[0].textAnnotations[0].description;

      // 🔽 認識結果を整形（trim + lowercase）
      const cleanedText = text.trim().toLowerCase();

      // 🔍 CSVデータ（sakelist）と照合
      const matchedSake = sakelist.find((sake) => {
        return (
          cleanedText.includes(sake.name?.trim().toLowerCase()) ||
          cleanedText.includes(sake.hiragana?.trim().toLowerCase()) ||
          cleanedText.includes(sake.roman?.trim().toLowerCase()) ||
          cleanedText.includes(sake.brewery?.trim().toLowerCase())
        );
      });

      if (matchedSake) {
        setResult(
          `🍶 ${matchedSake.name}（${matchedSake.brewery}）\n精米歩合：${matchedSake.polishing}\n特徴：${matchedSake.feature}`
        );
  
        // ✅ FastAPIへ履歴を送信！
        fetch('${API_BASE}/history', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchedSake),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ FastAPIからのレスポンス:", data);
            // 🔄 Remote履歴の再取得（これを追加！）
            if (onRemoteUpdate) {
              onRemoteUpdate();
            }
          })
          .catch((err) => {
            console.error("❌ 履歴送信エラー:", err);
          });
  
        // ✅ ローカルの履歴に追加
        setHistory((prev) => [...prev, matchedSake]);
  
      } else {
        setResult(`文字は読み取れましたが、日本酒データに一致する銘柄が見つかりませんでした。\n（認識されたテキスト：${text}）`);
      }
  
    } catch (error) {
      console.error("アップロードエラー:", error);
      setResult("画像の送信中にエラーが発生しました");
    }
  };

// JSXを返す（画面の内容）
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={image} alt="Uploaded Preview" width="200" />}
      {file && <button onClick={handleUpload}>画像を送信</button>}
      {result && (
        <div>
          <h3>検索結果：</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
