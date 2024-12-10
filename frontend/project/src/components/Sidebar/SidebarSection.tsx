import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  badge?: number;
}

export function SidebarSection({ title, icon, children, badge }: SidebarSectionProps) {
  return (
    <div className="py-4">
      <div className="px-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-700">{title}</h2>
        </div>
        {badge && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}