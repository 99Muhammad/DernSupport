import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:7121/api/Customers')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleView = (customerId) => {
    navigate(`/customer-management/${customerId}`);
  };

  const handleEdit = (customerId) => {
    navigate(`/customer-management/edit/${customerId}`);
  };

  const handleDelete = (customerId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      onOk: () => {
        axios.delete(`https://localhost:7121/api/Customers/${customerId}`)
          .then(() => {
            setCustomers(customers.filter(customer => customer.customerId !== customerId));
          })
          .catch(error => {
            setError(error);
          });
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      sorter: (a, b) => a.customerId - b.customerId,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Customer Type',
      dataIndex: 'customerType',
      key: 'customerType',
      filters: [
        { text: 'Business', value: 'Business' },
        { text: 'Individual', value: 'Individual' },
      ],
      onFilter: (value, record) => record.customerType.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record.customerId)}>View</Button>
          <Button type="default" onClick={() => handleEdit(record.customerId)}>Edit</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.customerId)}>Delete</Button>
        </Space>
      ),
    },
  ];

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
      <Title level={2} style={{ textAlign: 'center' }}>Customers List</Title>
      <Search
        placeholder="Search by name"
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
      />
      <Table 
        dataSource={filteredCustomers} 
        columns={columns} 
        rowKey="customerId" 
        pagination={{ position: ['bottomCenter'] }} // Center the pagination
      />
    </Card>
  );
};

export default CustomerList;