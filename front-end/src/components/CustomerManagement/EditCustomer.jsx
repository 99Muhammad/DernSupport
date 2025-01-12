// src/components/Admin/EditCustomer.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, Alert, Card, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const EditCustomer = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Customers/${customerId}`)
            .then(response => {
                setCustomer(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setError(error);
                setLoading(false);
            });
    }, [customerId]);

    const handleFormSubmit = (values) => {
        const payload = {
            customerId: customer.customerId,
            ...values
        };
        console.log('Updating customer with payload:', payload);
    
        axios.put(`https://localhost:7121/api/Customers/${customerId}`, payload)
            .then(response => {
                navigate('/customer-management');
            })
            .catch(error => {
                console.error('Error updating customer data:', error);
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
                description="There was an error fetching the customer data."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Customer</Title>
            <Form
                initialValues={customer}
                onFinish={handleFormSubmit}
                layout="vertical"
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the customer name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Contact Info"
                    name="contactInfo"
                    rules={[{ required: true, message: 'Please input the contact info!' }]}
                >
                    <Input />
                </Form.Item>
                {customer?.customerType !== 'Individual' && (
                    <Form.Item
                        label="Location"
                        name="location"
                        rules={[{ required: true, message: 'Please input the location!' }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditCustomer;