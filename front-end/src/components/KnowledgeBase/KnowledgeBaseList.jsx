import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Card, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const KnowledgeBaseList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:7121/api/KnowledgeBase')
      .then(response => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleView = (knowledgeBaseArticleId) => {
    navigate(`/article/${knowledgeBaseArticleId}`);
  };

  const handleEdit = (id) => {
    navigate(`/article/edit/${id}`);
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
      title: 'Article ID',
      dataIndex: 'knowledgeBaseArticleId',
      key: 'knowledgeBaseArticleId',
      sorter: (a, b) => a.knowledgeBaseArticleId - b.knowledgeBaseArticleId,
      ...getColumnSearchProps('knowledgeBaseArticleId'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record.knowledgeBaseArticleId)}>View</Button>
          <Button type="default" onClick={() => handleEdit(record.knowledgeBaseArticleId)}>Edit</Button>
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
        description="There was an error fetching the articles."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Knowledge Base Articles</Title>
      <Table 
        dataSource={articles} 
        columns={columns} 
        rowKey="knowledgeBaseArticleId" 
        pagination={{ position: ['bottomCenter'] }} // Center the pagination
      />
    </Card>
  );
};

export default KnowledgeBaseList;