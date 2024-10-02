import React from 'react';
import { theme } from 'antd';

const LoadingSpinner: React.FC = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  return (
    <div style={{ backgroundColor: colorBgLayout, ...styles.spinnerContainer }}>
      <div style={styles.spinner} />
      <p style={styles.loadingText} />
    </div>
  );
};

const styles = {
  spinnerContainer: {
    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#555',
  },
};

const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);

export default LoadingSpinner;
