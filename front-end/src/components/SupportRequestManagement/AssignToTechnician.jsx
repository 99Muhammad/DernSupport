import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Typography, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const AssignToTechnician = () => {
    const { supportRequestId } = useParams();
    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:7121/api/Technicians')
            .then(response => {
                setTechnicians(response.data);
            })
            .catch(error => {
                message.error('Failed to fetch technicians');
                console.error(error);
            });
    }, []);

    const onFinish = (values) => {
        setLoading(true);
        const payload = {
            supportRequestId: supportRequestId,
            scheduledDate: values.scheduledDate.toISOString(),
            technicianId: values.technicianId,
            priority: values.priority,
        };
        axios.post('https://localhost:7121/api/Jobs', payload)
            .then(() => {
                message.success('Job assigned successfully');
                navigate(`/support-request-management/${supportRequestId}`);
            })
            .catch(error => {
                message.error('Failed to assign job');
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2}>Assign to Technician</Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Scheduled Date"
                    name="scheduledDate"
                    rules={[{ required: true, message: 'Please select the scheduled date!' }]}
                >
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item
                    label="Technician"
                    name="technicianId"
                    rules={[{ required: true, message: 'Please select a technician!' }]}
                >
                    <Select placeholder="Select a technician">
                        {technicians.map(technician => (
                            <Option key={technician.id} value={technician.id}>
                                {technician.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{ required: true, message: 'Please select the priority!' }]}
                >
                    <Select>
                        <Option value={0}>Low</Option>
                        <Option value={1}>Medium</Option>
                        <Option value={2}>High</Option>
                    </Select>
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

export default AssignToTechnician;