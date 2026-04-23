import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VNPayGateway = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/account');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <h1>Dang xu ly VNPay...</h1>
      <p>Khong tat trinh duyet</p>
    </div>
  );
};

export default VNPayGateway;
