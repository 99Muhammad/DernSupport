import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const TechnicianForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values) => {
        setLoading(true);
        console.log('Payload:', values); // Log the payload for debugging
        axios.post('https://localhost:7121/api/Technicians', values)
            .then(response => {
                console.log('Response:', response); // Log the response for debugging
                message.success('Technician created successfully');
                navigate('/technician-management');
            })
            .catch(error => {
                console.error('Error:', error); // Log the error for debugging
                message.error('Failed to create technician');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2}>Create Technician</Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="id"
                    initialValue={0}
                    hidden
                >
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default TechnicianForm;