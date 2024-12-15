// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // エラーが発生したらstateを更新
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // エラーログを記録したりできます
    console.log('エラーが発生しました:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // エラー発生時に表示するUI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>申し訳ありません。エラーが発生しました。</h2>
          <p>エラー内容: {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px', margin: '10px' }}
          >
            ページを再読み込み
          </button>
        </div>
      );
    }

    // エラーがない場合は子コンポーネントを表示
    return this.props.children;
  }
}

export default ErrorBoundary;