import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, Info, Server } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { getCurrentBackend, switchBackend } from '@/utils/api';

const Navigation = () => {
  const location = useLocation();
  const [currentBackend, setCurrentBackend] = useState<string>(getCurrentBackend());

  const navItems = [
    { path: '/', label: 'Upload', icon: Home },
    { path: '/results', label: 'Results', icon: BarChart3 },
    { path: '/about', label: 'About', icon: Info },
  ];

  const handleBackendChange = (useSecondary: boolean) => {
    const backend = switchBackend(useSecondary);
    setCurrentBackend(backend);
    // Optional: reload the page or clear any cached data
  };

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 nailedit-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">NailedIT</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={isActive ? "nailedit-gradient" : ""}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      <Icon size={16} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            
            {/* Backend Selection Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Server size={14} />
                  <span className="hidden sm:inline text-xs">Backend</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleBackendChange(false)}
                  className={currentBackend.includes("http://localhost:8000") ? "bg-muted" : ""}
                >
                  Primary Backend
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleBackendChange(true)}
                  className={currentBackend.includes("nailedit-backend-9rey.onrender.com") ? "bg-muted" : ""}
                >
                  Secondary Backend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
