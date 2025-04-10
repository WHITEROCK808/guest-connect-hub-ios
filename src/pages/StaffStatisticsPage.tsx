
import React from "react";
import Layout from "../components/Layout";
import MessageStatistics from "../components/staff/MessageStatistics";
import { useLanguage } from "../contexts/LanguageContext";

const StaffStatisticsPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout title={t("staff.statistics.pageTitle")}>
      <MessageStatistics />
    </Layout>
  );
};

export default StaffStatisticsPage;
