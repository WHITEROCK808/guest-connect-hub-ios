
import React from "react";
import Layout from "../components/Layout";
import StaffLogin from "../components/staff/StaffLogin";
import { useLanguage } from "../contexts/LanguageContext";

const StaffLoginPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout title={t("staff.login.title")}>
      <StaffLogin />
    </Layout>
  );
};

export default StaffLoginPage;
