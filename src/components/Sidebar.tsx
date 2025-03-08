
import React, { useState } from "react";
import { Music, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    {
      title: "Song Pool",
      icon: <Music size={isMobile ? 20 : 22} />,
      path: "/"
    },
    {
      title: "Broadcast",
      icon: <Radio size={isMobile ? 20 : 22} />,
      path: "/broadcast"
    }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 z-40">
        <nav className="flex justify-around py-3">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "text-white" 
                  : "text-white/60 hover:text-white/80"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "hidden sm:block bg-[#0a0a0a] border-r border-white/10 h-screen fixed transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[220px]"
      )}
    >
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 bg-[#0a0a0a] p-1 rounded-full border border-white/10 text-white/60 hover:text-white z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <div className="p-4 h-20 flex items-center">
        {/* Removed "Music App" text */}
      </div>
      
      <nav className="p-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all mb-1",
              location.pathname === item.path 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:bg-white/5 hover:text-white/80"
            )}
          >
            {item.icon}
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
