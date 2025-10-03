import { useState } from 'react';
import { Ticket } from './TicketForm';
import { Calendar, Clock, User, AlertCircle, Search, Filter } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  userRole: 'client' | 'it-executive';
  userEmail: string;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: Ticket['status']) => void;
  onAssignTicket: (ticketId: string, assignee: string) => void;
}

export function TicketList({ 
  tickets, 
  userRole, 
  userEmail, 
  onTicketSelect, 
  onStatusUpdate, 
  onAssignTicket 
}: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');

  const filteredTickets = tickets.filter(ticket => {
    // Filter by user role
    if (userRole === 'client' && ticket.submittedBy !== userEmail) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter !== 'todos' && ticket.status !== statusFilter) {
      return false;
    }

    // Filter by priority
    if (priorityFilter !== 'todos' && ticket.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'em-andamento': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'resolvido': return 'bg-green-100 text-green-800 border border-green-200';
      case 'fechado': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800 border border-red-200';     // Vermelho
      case 'alta': return 'bg-orange-100 text-orange-800 border border-orange-200'; // Laranja
      case 'media': return 'bg-green-100 text-green-800 border border-green-200';   // Verde
      case 'baixa': return 'bg-gray-100 text-gray-800 border border-gray-200';      // Cinza
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'aberto': 'Aberto',
      'em-andamento': 'Em Andamento',
      'resolvido': 'Resolvido',
      'fechado': 'Fechado'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'urgente': 'Urgente',
      'alta': 'Alta',
      'media': 'Média',
      'baixa': 'Baixa'
    };
    return priorityMap[priority] || priority;
  };

  const itExecutives = ['joao.silva@empresa.com', 'maria.santos@empresa.com', 'carlos.oliveira@empresa.com'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros & Pesquisa
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar chamados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os status</option>
              <option value="aberto">Aberto</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>

            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todas Prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredTickets.length} chamado{filteredTickets.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Não encontramos nenhum chamado</h3>
              <p className="text-gray-500">
                {userRole === 'client' 
                  ? 'Você ainda não enviou nenhum chamado.' 
                  : 'Nenhum chamado corresponde aos filtros atuais.'}
              </p>
            </div>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTicketSelect(ticket)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {userRole === 'it-executive' ? ticket.submittedBy : 'Você'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Atualizado {formatDate(ticket.updatedAt)}
                      </div>
                      {ticket.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Designado para {ticket.assignedTo.split('@')[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userRole === 'it-executive' && (
                    <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.status}
                        onChange={(e) => onStatusUpdate(ticket.id, e.target.value as Ticket['status'])}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="aberto">Aberto</option>
                        <option value="em-andamento">Em Andamento</option>
                        <option value="resolvido">Resolvido</option>
                        <option value="fechado">Fechado</option>
                      </select>
                      
                      {!ticket.assignedTo && (
                        <select 
                          onChange={(e) => onAssignTicket(ticket.id, e.target.value)}
                          defaultValue=""
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Atribuir</option>
                          {itExecutives.map((exec) => (
                            <option key={exec} value={exec}>
                              {exec.split('@')[0]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}