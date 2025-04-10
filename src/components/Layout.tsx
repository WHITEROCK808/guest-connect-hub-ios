
import React from "react";
import HeaderBar from "./HeaderBar";

interface LayoutProps {
  children: React.ReactNode;
  onBackClick?: () => void;
  showBackButton?: boolean;
  title?: string;
}

const Layout = ({ 
  children, 
  onBackClick, 
  showBackButton = false,
  title 
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderBar 
        onBackClick={onBackClick} 
        showBackButton={showBackButton}
        title={title}
      />
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
