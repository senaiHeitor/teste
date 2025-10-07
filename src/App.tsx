  import { useState, useEffect } from 'react';
  import { TicketForm, Ticket } from './components/TicketForm';
  import { TicketList } from './components/TicketList';
  import { TicketDetail } from './components/TicketDetail';
  import { TicketDashboard } from './components/TicketDashboard';
  import { 
    Ticket as TicketIcon,
    Clock,
    CheckCircle,
    TrendingUp,
    Plus
  } from 'lucide-react';
  import { toast } from 'sonner';
  import { Login } from './components/Login';

  export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<'client' | 'it-executive'>('client');
    const [userEmail, setUserEmail] = useState('');
    const [activeView, setActiveView] = useState<'dashboard' | 'tickets' | 'submit' | 'detail'>('dashboard');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    // Mock inicial em português
    useEffect(() => {
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Computador não liga após atualização do Windows',
          description: 'Após a última atualização do Windows ontem à noite, meu computador mostra uma tela azul ao iniciar...',
          priority: 'alta',
          category: 'Hardware',
          status: 'aberto',
          submittedBy: 'usuario@empresa.com',
          assignedTo: 'joao.silva@empresa.com',
          createdAt: new Date('2024-01-15T09:30:00'),
          updatedAt: new Date('2024-01-15T10:15:00'),
          comments: [],
          attachments: [],
          equipmentNumber: 'PAT-001234',
          location: 'Sede Principal'
        },
        {
          id: '2',
          title: 'Não consigo acessar unidade de rede compartilhada',
          description: 'Não consigo acessar a pasta \\\\servidor\\compartilhada...',
          priority: 'media',
          category: 'Conexão com Internet',
          status: 'em-andamento',
          submittedBy: 'alice.silva@empresa.com',
          assignedTo: 'maria.santos@empresa.com',
          createdAt: new Date('2024-01-14T14:20:00'),
          updatedAt: new Date('2024-01-15T08:45:00'),
          comments: [],
          attachments: [],
          equipmentNumber: '',
          location: 'Filial Centro'
        }
      ];
      setTickets(mockTickets);
    }, []);

    // 🚀 Se não estiver logado, mostra tela de login
    if (!isAuthenticated) {
      return (
        <Login
          onLogin={(email, role) => {
            setUserEmail(email);
            setUserRole(role);
            setIsAuthenticated(true);
          }}
        />
      );
    }

    // Funções de manipulação de tickets - CORRIGIDA
    const handleSubmitTicket = (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => {
      const newTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
        status: 'aberto',
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        attachments: ticketData.attachments || [],
        equipmentNumber: ticketData.equipmentNumber || '',
        location: ticketData.location || ''
      };
      setTickets(prev => [newTicket, ...prev]);
      setActiveView('tickets');
      toast.success('Chamado enviado com sucesso!');
    };

    const handleStatusUpdate = (ticketId: string, status: Ticket['status']) => {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status, updatedAt: new Date() }
          : ticket
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status, updatedAt: new Date() } : null);
      }
      
      // Mensagem em português
      const statusMessages = {
        'aberto': 'aberto',
        'em-andamento': 'em andamento', 
        'resolvido': 'resolvido',
        'fechado': 'fechado'
      };
      toast.success(`Status do chamado atualizado para ${statusMessages[status]}`);
    };

    const handleAssignTicket = (ticketId: string, assignee: string) => {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo: assignee, updatedAt: new Date() }
          : ticket
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, assignedTo: assignee, updatedAt: new Date() } : null);
      }
      toast.success(`Chamado designado para ${assignee.split('@')[0]}`);
    };

    const handleAddComment = (ticketId: string, comment: string, isInternal: boolean) => {
      const newComment = {
        id: Date.now().toString(),
        author: userEmail,
        content: comment,
        timestamp: new Date(),
        isInternal
      };
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, comments: [...ticket.comments, newComment], updatedAt: new Date() }
          : ticket
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, comments: [...prev.comments, newComment], updatedAt: new Date() } : null);
      }
      toast.success('Comentário adicionado com sucesso!');
    };

    const handleTicketSelect = (ticket: Ticket) => {
      setSelectedTicket(ticket);
      setActiveView('detail');
    };

    // Dashboard stats
    const stats = {
      total: tickets.length,
      aberto: tickets.filter(t => t.status === 'aberto').length,
      emAndamento: tickets.filter(t => t.status === 'em-andamento').length,
      resolvido: tickets.filter(t => t.status === 'resolvido').length,
      meusChamados: userRole === 'client' 
        ? tickets.filter(t => t.submittedBy === userEmail).length 
        : tickets.filter(t => t.assignedTo === userEmail).length
    };

    const renderDashboard = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              {userRole === 'client'
                ? 'Enviado e direcionado para a equipe de TI'
                : 'Suas solicitações atribuídas e status geral'}
            </p>
          </div>
          {userRole === 'client' && (
            <button 
              onClick={() => setActiveView('submit')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Novo Chamado
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center p-6">
              <TicketIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center p-6">
              <Clock className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Aberto</p>
                <p className="text-2xl font-semibold">{stats.aberto}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center p-6">
              <TrendingUp className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Em andamento</p>
                <p className="text-2xl font-semibold">{stats.emAndamento}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center p-6">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Resolvido</p>
                <p className="text-2xl font-semibold">{stats.resolvido}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard do analista de TI - SÓ APARECE PARA ANALISTAS */}
        {userRole === 'it-executive' && (
          <div className="mt-8">
            <TicketDashboard
              tickets={tickets}
              userRole={userRole}
              onTicketSelect={handleTicketSelect}
            />
          </div>
        )}
      </div>
    );

    // Função para estilizar botões baseado na view ativa
    const getButtonStyle = (isActive: boolean) => 
      isActive 
        ? "bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        : "text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200";

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-8 w-8 text-blue-600" />
                  <h1 className="text-xl font-semibold text-gray-900">Suporte TI</h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <button 
                    className={getButtonStyle(activeView === 'dashboard')}
                    onClick={() => setActiveView('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button 
                    className={getButtonStyle(activeView === 'tickets')}
                    onClick={() => setActiveView('tickets')}
                  >
                    Todos Chamados
                  </button>
                  {userRole === 'client' && (
                    <button 
                      className={getButtonStyle(activeView === 'submit')}
                      onClick={() => setActiveView('submit')}
                    >
                      Enviar Chamado
                    </button>
                  )}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">{userEmail}</span>
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'tickets' && (
            <TicketList
              tickets={tickets}
              userRole={userRole}
              userEmail={userEmail}
              onTicketSelect={handleTicketSelect}
              onStatusUpdate={handleStatusUpdate}
              onAssignTicket={handleAssignTicket}
            />
          )}
          {activeView === 'submit' && userRole === 'client' && (
            <TicketForm onSubmit={handleSubmitTicket} userEmail={userEmail} />
          )}
          {activeView === 'detail' && selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              userRole={userRole}
              userEmail={userEmail}
              onBack={() => setActiveView('tickets')}
              onAddComment={handleAddComment}
              onStatusUpdate={handleStatusUpdate}
              onAssignTicket={handleAssignTicket}
            />
          )}
        </main>
      </div>
    );
  }