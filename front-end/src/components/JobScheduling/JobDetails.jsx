import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Typography, Descriptions, Button } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7121/api/Jobs/${jobId}`)
      .then(response => {
        setJob(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [jobId]);

  const handleDelete = () => {
    axios.delete(`https://localhost:7121/api/Jobs/${jobId}`)
      .then(() => {
        navigate('/Job-management'); // Redirect to the job list after deletion
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
      <Title level={2} style={{ textAlign: 'center' }}>Job Details</Title>
      <Descriptions bordered>
        <Descriptions.Item label="Job ID">{job.jobId}</Descriptions.Item>
        <Descriptions.Item label="Support Request ID">{job.supportRequestId}</Descriptions.Item>
        <Descriptions.Item label="Scheduled Date">{new Date(job.scheduledDate).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Technician">{job.technician}</Descriptions.Item>
        <Descriptions.Item label="Priority">{job.priority}</Descriptions.Item>
      </Descriptions>
      <Button type="primary" danger onClick={handleDelete} style={{ marginTop: '20px' }}>Delete</Button>
    </Card>
  );
};

export default JobDetails;