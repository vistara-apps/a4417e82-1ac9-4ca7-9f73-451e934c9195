'use client';

import { useState } from 'react';
import { Home, Users, BookOpen, Briefcase, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex glass-card p-4 space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'primary' : 'ghost'}
              size="md"
              onClick={() => onTabChange(item.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={toggleMobileMenu}
          className="fixed top-4 right-4 z-50"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="glass-card m-4 mt-20 p-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'primary' : 'ghost'}
                    size="md"
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 justify-start"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card p-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center space-y-1 px-1 py-2 min-w-0 flex-1"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </>
  );
}
