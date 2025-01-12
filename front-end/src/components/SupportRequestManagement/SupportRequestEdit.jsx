import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Alert, Card, Typography } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SupportRequestEdit = () => {
    const { supportRequestId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Support/${supportRequestId}`)
            .then(response => {
                form.setFieldsValue(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [supportRequestId, form]);

    const onFinish = (values) => {
        const payload = { ...values, supportRequestId };
        axios.put(`https://localhost:7121/api/Support/${supportRequestId}`, payload)
            .then(() => {
                navigate(`/support-request-management/${supportRequestId}`);
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
                description="There was an error fetching the support request details."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Support Request</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please enter the status' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SupportRequestEdit;