import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, LogOut, Terminal } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { SidebarSection } from './SidebarSection';

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="relative z-10 w-64 bg-black/80 backdrop-blur-sm border-r border-orange-500/30 flex flex-col">
      <div className="p-4 border-b border-orange-500/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-bold neon-text">Terminal</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <SidebarSection
          title="Conexões"
          icon={<Users size={20} className="text-orange-500" />}
        >
          <div className="px-4 py-2">
            <button
              onClick={() => navigate('/connections')}
              className="w-full text-left px-4 py-2 rounded-lg text-orange-500 
                       hover:bg-orange-500/10 transition-colors"
            >
              Ver todas as conexões
            </button>
          </div>
        </SidebarSection>

        <SidebarSection
          title="Mensagens"
          icon={<MessageSquare size={20} className="text-orange-500" />}
          badge={3}
        >
          <div className="px-4 py-2">
            <button
              onClick={() => navigate('/messages')}
              className="w-full text-left px-4 py-2 rounded-lg text-orange-500 
                       hover:bg-orange-500/10 transition-colors"
            >
              Ver todas as mensagens
            </button>
          </div>
        </SidebarSection>
      </div>

      <button
        onClick={handleLogout}
        className="p-4 flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors
                 border-t border-orange-500/30"
      >
        <LogOut size={20} />
        <span>Desconectar</span>
      </button>
    </aside>
  );
}