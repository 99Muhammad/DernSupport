import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, Alert, Card, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const TechnicianEdit = () => {
    const { technicianId } = useParams();
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Technicians/${technicianId}`)
            .then(response => {
                setTechnician(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [technicianId]);

    const handleFormSubmit = (values) => {
        const payload = {
            id: technician.id,
            ...values
        };
        axios.put(`https://localhost:7121/api/Technicians/${technicianId}`, payload)
            .then(response => {
                navigate('/technician-management');
            })
            .catch(error => {
                setError(error);
            });
    };

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
            <Title level={2} style={{ textAlign: 'center' }}>Edit Technician</Title>
            <Form
                initialValues={technician}
                onFinish={handleFormSubmit}
                layout="vertical"
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the technician name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input the email!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input the password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default TechnicianEdit;