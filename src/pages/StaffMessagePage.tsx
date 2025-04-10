
import React from "react";
import Layout from "../components/Layout";
import MessageDetail from "../components/staff/MessageDetail";
import { useParams } from "react-router-dom";

const StaffMessagePage = () => {
  const { messageId } = useParams<{ messageId: string }>();
  
  return (
    <Layout>
      <MessageDetail messageId={messageId} />
    </Layout>
  );
};

export default StaffMessagePage;
