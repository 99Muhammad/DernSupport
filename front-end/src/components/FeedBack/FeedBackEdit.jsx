import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Alert, Card, Typography, Rate } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const FeedBackEdit = () => {
    const { feedbackId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Feedbacks/${feedbackId}`)
            .then(response => {
                form.setFieldsValue(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [feedbackId, form]);

    const onFinish = (values) => {
        const payload = {
            ...values,
            feedbackId: feedbackId
        };

        axios.put(`https://localhost:7121/api/Feedbacks/${feedbackId}`, payload)
            .then(() => {
                navigate(`/feedback-management/${feedbackId}`);
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
                description="There was an error fetching the feedback details."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Feedback</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="rating"
                    label="Rating"
                    rules={[{ required: true, message: 'Please enter the rating' }]}
                >
                    <Rate />
                </Form.Item>
                <Form.Item
                    name="comments"
                    label="Comments"
                    rules={[{ required: true, message: 'Please enter the comments' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FeedBackEdit;