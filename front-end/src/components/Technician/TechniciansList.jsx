import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';


const { Title } = Typography;

const TechniciansList = ({ data }) => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:7121/api/Technicians')
            .then(response => {
                setTechnicians(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleView = (id) => {
        navigate(`/technician-management/${id}`);
    };
    
    const handleEdit = (id) => {
        navigate(`/technician-management/edit/${id}`);
    };
    
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this technician?',
            onOk: () => {
                axios.delete(`https://localhost:7121/api/Technicians/${id}`)
                    .then(() => {
                        setTechnicians(technicians.filter(technician => technician.id !== id));
                    })
                    .catch(error => {
                        setError(error);
                    });
            },
        });
    };

    const handleCreate = () => {
        navigate('/technician-management/create');
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
                description="There was an error fetching the technician data."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>Technicians List</Title>
                <Button type="primary" onClick={handleCreate}>Create Technician</Button>
            </div>
            <Table 
                dataSource={technicians} 
                columns={[
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        sorter: (a, b) => a.name.localeCompare(b.name),
                        ...getColumnSearchProps('name'),
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                        sorter: (a, b) => a.email.localeCompare(b.email),
                        ...getColumnSearchProps('email'),
                    },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button type="primary" onClick={() => handleView(record.id)}>View</Button>
                                <Button type="default" onClick={() => handleEdit(record.id)}>Edit</Button>
                                <Button type="primary" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} 
                rowKey="id" 
                pagination={{ position: ['bottomCenter'] }} // Center the pagination
            />
        </Card>
    );
};

export default TechniciansList;