import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const FeedBackList = ({ userRole }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:7121/api/Feedbacks')
            .then(response => {
                setFeedbacks(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleView = (id) => {
        navigate(`/feedback-management/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/feedback-management/edit/${id}`);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this feedback?',
            onOk: () => {
                axios.delete(`https://localhost:7121/api/Feedbacks/${id}`)
                    .then(() => {
                        setFeedbacks(feedbacks.filter(feedback => feedback.feedbackId !== id));
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
            title: 'Feedback ID',
            dataIndex: 'feedbackId',
            key: 'feedbackId',
            sorter: (a, b) => a.feedbackId - b.feedbackId,
            ...getColumnSearchProps('feedbackId'),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            ...getColumnSearchProps('customerName'),
        },
        {
            title: 'Support Request ID',
            dataIndex: 'supportRequestId',
            key: 'supportRequestId',
            sorter: (a, b) => a.supportRequestId - b.supportRequestId,
            ...getColumnSearchProps('supportRequestId'),
        },
        {
            title: 'Date Submitted',
            dataIndex: 'dateSubmitted',
            key: 'dateSubmitted',
            sorter: (a, b) => new Date(a.dateSubmitted) - new Date(b.dateSubmitted),
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleView(record.feedbackId)}>View</Button>
                    <Button type="default" onClick={() => handleEdit(record.feedbackId)}>Edit</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.feedbackId)}>Delete</Button>
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
                description="There was an error fetching the feedbacks."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Feedbacks</Title>
            <Table 
                dataSource={feedbacks} 
                columns={columns} 
                rowKey="feedbackId" 
                pagination={{ position: ['bottomCenter'] }} // Center the pagination
            />
        </Card>
    );
};

export default FeedBackList;