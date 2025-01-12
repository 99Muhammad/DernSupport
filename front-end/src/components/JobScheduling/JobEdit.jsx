import React, { useEffect, useState } from 'react';
import { Form, Button, Spin, Alert, Card, Typography, DatePicker, InputNumber, Select } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const JobEdit = () => {
    const { jobId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://localhost:7121/api/Jobs/${jobId}`)
            .then(response => {
                const jobData = response.data;
                jobData.scheduledDate = moment(jobData.scheduledDate);
                form.setFieldsValue(jobData);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        axios.get('https://localhost:7121/api/Technicians')
            .then(response => {
                setTechnicians(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, [jobId, form]);

    const onFinish = (values) => {
        const payload = { ...values, jobId };
        values.scheduledDate = values.scheduledDate.toISOString();
        axios.put(`https://localhost:7121/api/Jobs/${jobId}`, payload)
            .then(() => {
                navigate(`/Job-management/${jobId}`);
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
                description="There was an error fetching the job details."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Job</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="scheduledDate"
                    label="Scheduled Date"
                    rules={[{ required: true, message: 'Please select the scheduled date' }]}
                >
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item
                    name="technicianId"
                    label="Technician"
                    rules={[{ required: true, message: 'Please select a technician' }]}
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
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please enter the priority' }]}
                >
                    <InputNumber min={1} max={10} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default JobEdit;