const fs = require('fs');
const path = require('path');

const routes = [
  'customers', 'marketplace', 'tasks', 'bookings', 'trips', 'calendar',
  'packages', 'vendors', 'partners', 'revenue', 'analytics', 'marketing',
  'affiliates', 'notifications', 'subscription', 'billing', 'settings'
];

const basePath = path.join(__dirname, 'src', 'app', '(crm)', 'agency');

routes.forEach(route => {
  const dirPath = path.join(basePath, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const componentName = route.charAt(0).toUpperCase() + route.slice(1) + 'Page';
    const content = `"use client";

import { Building2 } from "lucide-react";

export default function ${componentName}() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center border border-white/5 bg-[#0B1220] rounded-md border-dashed">
      <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center mb-4">
        <Building2 className="w-6 h-6 text-[#14B8A6]" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">${route.toUpperCase()} MODULE</h1>
      <p className="text-sm text-[#94A3B8]">This module is scheduled for development in an upcoming sprint.</p>
    </div>
  );
}
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
  }
});
