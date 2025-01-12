import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const JobList = ({ userRole }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:7121/api/Jobs')
            .then(response => {
                setJobs(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleView = (id) => {
        navigate(`/Job-management/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/Job-management/edit/${id}`);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this job?',
            onOk: () => {
                axios.delete(`https://localhost:7121/api/Jobs/${id}`)
                    .then(() => {
                        setJobs(jobs.filter(job => job.jobId !== id));
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
            title: 'Job ID',
            dataIndex: 'jobId',
            key: 'jobId',
            sorter: (a, b) => a.jobId - b.jobId,
            ...getColumnSearchProps('jobId'),
        },
        {
            title: 'Support Request ID',
            dataIndex: 'supportRequestId',
            key: 'supportRequestId',
            sorter: (a, b) => a.supportRequestId - b.supportRequestId,
            ...getColumnSearchProps('supportRequestId'),
        },
        {
            title: 'Scheduled Date',
            dataIndex: 'scheduledDate',
            key: 'scheduledDate',
            sorter: (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate),
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Technician',
            dataIndex: 'technician',
            key: 'technician',
            sorter: (a, b) => a.technician.localeCompare(b.technician),
            ...getColumnSearchProps('technician'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleView(record.jobId)}>View</Button>
                    <Button type="default" onClick={() => handleEdit(record.jobId)}>Edit</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.jobId)}>Delete</Button>
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
                description="There was an error fetching the jobs."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Jobs</Title>
            <Table 
                dataSource={jobs} 
                columns={columns} 
                rowKey="jobId" 
                pagination={{ position: ['bottomCenter'] }} // Center the pagination
            />
        </Card>
    );
};

export default JobList;