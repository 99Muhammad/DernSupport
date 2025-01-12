import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Space, Modal, Card, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SupportRequestList = ({ userRole, userId }) => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:7121/api/Support')
            .then(response => {
                let requests = response.data;
                if (userRole === 'Customer') {
                    requests = requests.filter(request => request.customerId === userId);
                }
                setSupportRequests(requests);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [userRole, userId]);

    const handleView = (id) => {
        navigate(`/support-request-management/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/support-request-management/edit/${id}`);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this support request?',
            onOk: () => {
                axios.delete(`https://localhost:7121/api/Support/${id}`)
                    .then(() => {
                        setSupportRequests(supportRequests.filter(request => request.supportRequestId !== id));
                    })
                    .catch(error => {
                        setError(error);
                    });
            },
        });
    };

    const handleAssign = (id) => {
        navigate(`/assign-to-technician/${id}`);
    };

    const columns = [
        {
            title: 'Request ID',
            dataIndex: 'supportRequestId',
            key: 'supportRequestId',
        },
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
            key: 'customerId',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleView(record.supportRequestId)}>View</Button>
                    <Button type="default" onClick={() => handleEdit(record.supportRequestId)}>Edit</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.supportRequestId)}>Delete</Button>
                    {userRole === 'Admin' && (
                        <Button type="primary" onClick={() => handleAssign(record.supportRequestId)}>Assign to Technician</Button>
                    )}
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
                description="There was an error fetching the support requests."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Support Requests</Title>
            <Table 
                dataSource={supportRequests} 
                columns={columns} 
                rowKey="supportRequestId" 
                pagination={{ position: ['bottomCenter'] }} // Center the pagination
            />
        </Card>
    );
};

export default SupportRequestList;