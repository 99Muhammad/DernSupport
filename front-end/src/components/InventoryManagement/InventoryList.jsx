import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography, Input } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const InventoryList = ({ userRole }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:7121/api/SpareParts')
      .then(response => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleView = (id) => {
    navigate(`/inventory-management/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/inventory-management/edit/${id}`);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this inventory item?',
      onOk: () => {
        axios.delete(`https://localhost:7121/api/SpareParts/${id}`)
          .then(() => {
            setInventory(inventory.filter(item => item.sparePartId !== id));
          })
          .catch(error => {
            setError(error);
          });
      },
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Spare Part ID',
      dataIndex: 'sparePartId',
      key: 'sparePartId',
      sorter: (a, b) => a.sparePartId - b.sparePartId,
      ...getColumnSearchProps('sparePartId'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record.sparePartId)}>View</Button>
          <Button type="default" onClick={() => handleEdit(record.sparePartId)}>Edit</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.sparePartId)}>Delete</Button>
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
        description="There was an error fetching the inventory."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Inventory</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/inventory-management/create')}
        >
          Add Product
        </Button>
      </div>
      <Table 
        dataSource={inventory} 
        columns={columns} 
        rowKey="sparePartId" 
        pagination={{ position: ['bottomCenter'] }} // Center the pagination
      />
    </Card>
  );
};

export default InventoryList;