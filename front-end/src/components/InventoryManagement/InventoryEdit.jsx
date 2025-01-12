import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Alert, Card, Typography, InputNumber } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const InventoryEdit = () => {
    const { inventoryId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/SpareParts/${inventoryId}`)
            .then(response => {
                form.setFieldsValue(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [inventoryId, form]);

    const onFinish = (values) => {
        axios.put(`https://localhost:7121/api/SpareParts/${inventoryId}`, values)
            .then(() => {
                navigate(`/inventory-management/${inventoryId}`);
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
            <Title level={2} style={{ textAlign: 'center' }}>Edit Inventory</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter the name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="quantityInStock"
                    label="Quantity In Stock"
                    rules={[{ required: true, message: 'Please enter the quantity in stock' }]}
                >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter the price' }]}
                >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default InventoryEdit;