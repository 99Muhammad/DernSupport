import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Typography, Descriptions } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const KnowledgeBaseArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7121/api/KnowledgeBase/${id}`)
      .then(response => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

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
        description="There was an error fetching the article details."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>{article.title}</Title>
      <Descriptions bordered>
        <Descriptions.Item label="Article ID">{article.knowledgeBaseArticleId}</Descriptions.Item>
        <Descriptions.Item label="Category">{article.category}</Descriptions.Item>
        <Descriptions.Item label="Date Created">{new Date(article.dateCreated).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Date Updated">{new Date(article.dateUpdated).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Problem Description">{article.problemDescription}</Descriptions.Item>
        <Descriptions.Item label="Solution">{article.solution || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default KnowledgeBaseArticle;