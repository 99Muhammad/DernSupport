import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Typography, Descriptions, Button } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const FeedBackDetails = () => {
    const { feedbackId } = useParams();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Feedbacks/${feedbackId}`)
            .then(response => {
                setFeedback(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [feedbackId]);

    const handleDelete = () => {
        axios.delete(`https://localhost:7121/api/Feedbacks/${feedbackId}`)
            .then(() => {
                navigate('/feedback-management'); // Redirect to the feedback list after deletion
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
            <Title level={2} style={{ textAlign: 'center' }}>Feedback Details</Title>
            <Descriptions bordered>
                <Descriptions.Item label="Feedback ID">{feedback.feedbackId}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{feedback.customerName}</Descriptions.Item>
                <Descriptions.Item label="Support Request ID">{feedback.supportRequestId}</Descriptions.Item>
                <Descriptions.Item label="Rating">{feedback.rating}</Descriptions.Item>
                <Descriptions.Item label="Comments">{feedback.comments}</Descriptions.Item>
                <Descriptions.Item label="Date Submitted">{new Date(feedback.dateSubmitted).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" danger onClick={handleDelete} style={{ marginTop: '20px' }}>Delete</Button>
        </Card>
    );
};

export default FeedBackDetails;