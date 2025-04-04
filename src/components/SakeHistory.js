// src/components/SakeHistory.js

const SakeHistory = ({ history }) => {
    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>🍶 認識履歴</h3>
        {history.length === 0 ? (
          <p>まだ履歴はありません。</p>
        ) : (
          <ul>
            {history.map((sake, index) => (
              <li key={index}>
                {sake.name}（{sake.brewery}） - {sake.feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default SakeHistory;
  