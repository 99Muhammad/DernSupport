import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Alert, List, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const AnalyticsDashboard = () => {
    const [commonIssues, setCommonIssues] = useState([]);
    const [jobCompletionTimes, setJobCompletionTimes] = useState([]);
    const [customerSatisfaction, setCustomerSatisfaction] = useState([]);
    const [locationSupportJobs, setLocationSupportJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [commonIssuesRes, jobCompletionTimesRes, customerSatisfactionRes, locationSupportJobsRes] = await Promise.all([
                    axios.get('https://localhost:7121/api/Analytics/common-issues'),
                    axios.get('https://localhost:7121/api/Analytics/job-completion-times'),
                    axios.get('https://localhost:7121/api/Analytics/common-issues'),
                    axios.get('https://localhost:7121/api/Analytics/location-support-jobs')
                ]);

                setCommonIssues(commonIssuesRes.data);
                setJobCompletionTimes(jobCompletionTimesRes.data);
                setCustomerSatisfaction(customerSatisfactionRes.data);
                setLocationSupportJobs(locationSupportJobsRes.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                description="There was an error fetching the analytics data."
                type="error"
                showIcon
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Analytics Dashboard</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Common Issues">
                        <List
                            dataSource={commonIssues}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.issueDescription}
                                        description={`Count: ${item.count}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Job Completion Times">
                        <List
                            dataSource={jobCompletionTimes}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`Support Request ID: ${item.supportRequestId}`}
                                        description={`Completion Time: ${item.completionTime}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={12}>
                    <Card title="Customer Satisfaction">
                        <List
                            dataSource={customerSatisfaction}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`Customer ID: ${item.customerId}`}
                                        description={`Satisfaction Score: ${item.satisfactionScore}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Location Support Jobs">
                        <List
                            dataSource={locationSupportJobs}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`Location: ${item.location || 'Unknown'}`}
                                        description={`Job Count: ${item.jobCount}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AnalyticsDashboard;