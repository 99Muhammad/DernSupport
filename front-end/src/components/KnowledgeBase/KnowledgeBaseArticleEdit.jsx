import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Alert, Card, Typography } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const KnowledgeBaseArticleEdit = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/KnowledgeBase/${id}`)
            .then(response => {
                form.setFieldsValue(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [id, form]);

    const onFinish = (values) => {
        const payload = { ...values, knowledgeBaseArticleId: id };
        axios.put(`https://localhost:7121/api/KnowledgeBase/${id}`, payload)
            .then(() => {
                navigate(`/article/${id}`);
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
                description="There was an error fetching the article details."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Article</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter the title' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="problemDescription"
                    label="Problem Description"
                    rules={[{ required: true, message: 'Please enter the problem description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="solution"
                    label="Solution"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please enter the category' }]}
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

export default KnowledgeBaseArticleEdit;