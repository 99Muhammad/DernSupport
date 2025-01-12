import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Typography, Descriptions, Button } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const InventoryDetails = () => {
    const { inventoryId } = useParams();
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/SpareParts/${inventoryId}`)
            .then(response => {
                setInventory(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [inventoryId]);

    const handleDelete = () => {
        axios.delete(`https://localhost:7121/api/SpareParts/${inventoryId}`)
            .then(() => {
                navigate('/inventory-management'); // Redirect to the inventory list after deletion
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
                description="There was an error fetching the inventory details."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Inventory Details</Title>
            <Descriptions bordered>
                <Descriptions.Item label="Spare Part ID">{inventory.sparePartId}</Descriptions.Item>
                <Descriptions.Item label="Name">{inventory.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{inventory.description}</Descriptions.Item>
                <Descriptions.Item label="Quantity In Stock">{inventory.quantityInStock}</Descriptions.Item>
                <Descriptions.Item label="Price">{inventory.price}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" danger onClick={handleDelete} style={{ marginTop: '20px' }}>Delete</Button>
        </Card>
    );
};

export default InventoryDetails;