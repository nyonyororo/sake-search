import React from "react";

// 環境変数からAPIのURLを取得
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const RemoteSakeHistory = ({ history, onRemoteUpdate }) => {
  // 🧹 削除ボタンが押されたときの処理
  const handleClearHistory = () => {
    if (!window.confirm("本当に履歴を削除しますか？")) return;

    fetch(`${API_BASE}/history`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("履歴を削除しました！");
        console.log("🧹 削除完了:", data);
        if (onRemoteUpdate) {
          onRemoteUpdate(); // 最新の履歴を再取得
        }
      })
      .catch((err) => {
        console.error("❌ 削除エラー:", err);
        alert("削除に失敗しました");
      });
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📦 FastAPIの履歴一覧</h3>
      {history.length === 0 ? (
        <p>履歴はまだありません。</p>
      ) : (
        <>
          <ul>
            {history.map((sake, index) => (
              <li key={index}>
                <strong>{sake.name}</strong>（{sake.brewery}）<br />
                精米歩合：{sake.polishing}<br />
                特徴：{sake.feature}<br />
                保存日時：{new Date(sake.timestamp + "Z").toLocaleString('ja-JP', {
                  timeZone: 'Asia/Tokyo',
                })}
              </li>
            ))}
          </ul>

          <button onClick={handleClearHistory} style={{ marginTop: "1rem" }}>
            🧹 履歴をリセット
          </button>
        </>
      )}
    </div>
  );
};

export default RemoteSakeHistory;
