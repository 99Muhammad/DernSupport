import React from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const InventoryForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.post('https://localhost:7121/api/SpareParts', values)
            .then(() => {
                message.success('Product added successfully');
                navigate('/inventory-management');
            })
            .catch(error => {
                message.error('There was an error adding the product');
            });
    };

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Add Product</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ sparePartId: 0 }}
            >
                <Form.Item
                    name="sparePartId"
                    style={{ display: 'none' }}
                >
                    <InputNumber />
                </Form.Item>
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
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="quantityInStock"
                    label="Quantity in Stock"
                    rules={[{ required: true, message: 'Please enter the quantity in stock' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter the price' }]}
                >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Product</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default InventoryForm;