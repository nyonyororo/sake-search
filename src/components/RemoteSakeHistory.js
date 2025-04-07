import React from "react";

const RemoteSakeHistory = ({ history }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📦 FastAPIの履歴一覧</h3>
      {history.length === 0 ? (
        <p>履歴はまだありません。</p>
      ) : (
        <ul>
          {history.map((sake, index) => (
            <li key={index}>
              <strong>{sake.name}</strong>（{sake.brewery}）<br />
              精米歩合：{sake.polishing}<br />
              特徴：{sake.feature}<br />
              保存日時：{new Date(sake.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RemoteSakeHistory;
