
import React from "react";
import { Music, Radio } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
    <div className="hidden sm:block w-[220px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/10 h-screen fixed">
      <div className="p-4 h-20 flex items-center">
        <h1 className="text-xl font-bold text-white">Music App</h1>
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
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
