import React,{ useEffect, useState } from 'react';
import Papa from 'papaparse';




const ImageUpload = ({setHistory}) => {
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
  
// イベント処理関数
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setResult(null); // 新しい画像を選んだら結果をリセット
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('画像を選択してください');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Data URIからbase64だけ抜き出す

      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(JSON.stringify(data, null, 2));


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

    //   console.log("認識されたテキスト：", text);
      
    // データ照合
      const cleanedText = text.trim().toLowerCase();

      const matchedSake = sakeList.find((sake) => {
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
        // ✅ 履歴に追加！
        setHistory((prev) => [...prev, matchedSake]);
      } else {
        setResult(`文字は読み取れましたが、日本酒データに一致する銘柄が見つかりませんでした。\n（認識されたテキスト：${text}）`);
      }

    };

    reader.readAsDataURL(file); // ← Base64に変換開始
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
