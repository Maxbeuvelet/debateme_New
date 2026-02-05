import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const TabNavigationContext = createContext();

const mainTabs = [
  createPageUrl("Home"),
  createPageUrl("CreateDebate"),
  createPageUrl("Trending"),
  createPageUrl("Ranked"),
  createPageUrl("UserStats")
];

export function TabNavigationProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabHistory, setTabHistory] = useState({});
  const [lastMainTab, setLastMainTab] = useState(createPageUrl("Home"));

  useEffect(() => {
    // Track if current location is a main tab
    if (mainTabs.includes(location.pathname)) {
      setLastMainTab(location.pathname);
      
      // Save this as the history for this tab
      setTabHistory(prev => ({
        ...prev,
        [location.pathname]: location.pathname
      }));
    } else {
      // We're on a child page, remember it for the last main tab
      setTabHistory(prev => ({
        ...prev,
        [lastMainTab]: location.pathname
      }));
    }
  }, [location.pathname, lastMainTab]);

  const navigateToTab = (tabPath) => {
    // Check if we have saved history for this tab
    const savedPath = tabHistory[tabPath];
    
    if (savedPath && savedPath !== tabPath) {
      // Navigate to the saved child page
      navigate(savedPath);
    } else {
      // Navigate to the main tab
      navigate(tabPath);
    }
  };

  return (
    <TabNavigationContext.Provider value={{ navigateToTab, tabHistory }}>
      {children}
    </TabNavigationContext.Provider>
  );
}

export function useTabNavigation() {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error("useTabNavigation must be used within TabNavigationProvider");
  }
  return context;
}