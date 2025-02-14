import React from "react";
import { Table } from "antd";
import { LinkedinOutlined } from "@ant-design/icons";

const AboutUs = () => {
  const columns = [
    {
      title: "Team Member",
      dataIndex: "name",
      key: "name",
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
    { key: "1", name: "KALLURU BHAVESH SHANKAR", linkedin: "https://linkedin.com/in/alice" },
    { key: "2", name: "UMMADISETTY VENKATA TEJA", linkedin: "https://linkedin.com/in/bob" },
    { key: "3", name: "GANJIKUNTA RAGHAVENDRA", linkedin: "https://linkedin.com/in/charlie" },
    { key: "4", name: "PATHAKOTA MEGHA SHYAM REDDY", linkedin: "https://linkedin.com/in/david" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Our Team</h2>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default AboutUs;
