import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Typography, Descriptions } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const TechnicianDetails = () => {
    const { technicianId } = useParams();
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <Title level={2} style={{ textAlign: 'center' }}>Technician Details</Title>
            <Descriptions bordered>
                <Descriptions.Item label="Technician ID">{technician.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{technician.name}</Descriptions.Item>
                <Descriptions.Item label="Contact Info">{technician.email}</Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default TechnicianDetails;