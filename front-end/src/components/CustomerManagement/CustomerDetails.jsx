// src/components/Admin/CustomerDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert, Card, Typography, Descriptions } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7121/api/Customers/${customerId}`)
      .then(response => {
        setCustomer(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="There was an error fetching the customer data."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Customer Details</Title>
      <Descriptions bordered>
        <Descriptions.Item label="Customer ID">{customer.customerId}</Descriptions.Item>
        <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
        <Descriptions.Item label="Contact Info">{customer.contactInfo}</Descriptions.Item>
        <Descriptions.Item label="Customer Type">{customer.customerType}</Descriptions.Item>
        {customer.customerType !== 'Individual' && (
          <Descriptions.Item label="Location">{customer.location}</Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default CustomerDetails;



