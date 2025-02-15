import React from "react";
import { Table, Typography, Card, Row, Col } from "antd";
import { LinkedinOutlined, TeamOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const AboutUs = () => {
  const columns = [
    {
      title: "Team Member",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Text strong style={{ 
          fontSize: '15px',
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: '0.3px'
        }}>
          {text}
        </Text>
      ),
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "linkedin",
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined style={{ fontSize: "20px", color: "#0077B5" }} />
          </a>
        ) : (
          "N/A"
        ),
    },
  ];

  const data = [
    { key: "1", name: "KALLURU BHAVESH SHANKAR", linkedin: "https://www.linkedin.com/in/kalluru-bhavesh-shankar-083b13264/" },
    { key: "2", name: "UMMADISETTY VENKATA TEJA", linkedin: "https://www.linkedin.com/in/uvenkatateja" },
    { key: "3", name: "GANJIKUNTA RAGHAVENDRA", linkedin: "https://www.linkedin.com/in/raghavendra-g-7b2a01264" },
    { key: "4", name: "PATHAKOTA MEGHA SHYAM REDDY", linkedin: "https://www.linkedin.com/in/megha-shyam-reddy-pathakota-b0703b265/" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Row justify="center" align="middle">
        <Col xs={24} sm={20} md={16} lg={14} xl={12}>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card 
              style={{ 
                margin: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
                border: '1px solid #e8e8e8',
                transition: 'all 0.3s ease',
                fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
              }}
              hoverable
            >
              <Row justify="center" align="middle" gutter={[0, 16]}>
                <Col xs={24}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Title level={3} style={{ 
                      textAlign: 'center', 
                      marginBottom: '16px',
                      color: '#1a1a1a',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '28px'
                    }}>
                      <TeamOutlined style={{ 
                        marginRight: '12px',
                        color: '#1890ff'
                      }} />
                      Our Team
                    </Title>
                  </motion.div>
                </Col>
                <Col xs={24}>
                  <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={false}
                    responsive
                    size="middle"
                    style={{ 
                      overflowX: 'auto',
                      borderRadius: '6px',
                      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
                    }}
                    className="team-table"
                    components={{
                      header: {
                        cell: (props) => (
                          <th
                            {...props}
                            style={{
                              fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#262626',
                              background: '#fafafa',
                              letterSpacing: '0.3px'
                            }}
                          />
                        ),
                      },
                      body: {
                        row: (props) => (
                          <motion.tr
                            {...props}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: props['data-row-key'] * 0.1 + 0.5 
                            }}
                            whileHover={{ 
                              backgroundColor: '#f5f5f5',
                              scale: 1.01 
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default AboutUs;
//About us page