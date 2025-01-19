import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Service from '../../helpers/service';
import { Alert, Button, Spin } from 'antd';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const hasVerified = React.useRef(false);
  const verifyEmail = async () => {
    if (hasVerified.current) return;
    hasVerified.current = true;
    Service('/api/verify-emai')({
      data: {
        payload: {
          token,
        },
      },
    })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            'Something went wrong. Please try again later.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (token) {
      verifyEmail().catch(console.log);
    }
  }, [token]);
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {loading ? (
        <Spin tip="Verifying your email..." size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Alert
          message="Email Verified"
          description={message}
          type="success"
          showIcon
        />
      )}
    </div>
  );
};

export default VerifyEmail;
