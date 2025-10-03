import { useState, useMemo } from 'react';
import { Ticket } from './TicketForm';
import { Filter, Download, Search, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface TicketDashboardProps {
  tickets: Ticket[];
  userRole: string;
  onTicketSelect: (ticket: Ticket) => void;
}

interface Filters {
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  dateRange: string;
  search: string;
}

export function TicketDashboard({ tickets, userRole, onTicketSelect }: TicketDashboardProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    dateRange: '',
    search: ''
  });

  // Função para exportar para Excel
  const exportToExcel = () => {
    if (filteredTickets.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    // Simulação de exportação - em produção, usar uma biblioteca como xlsx
    const filteredData = filteredTickets.map(ticket => ({
      'ID': ticket.id,
      'Título': ticket.title,
      'Descrição': ticket.description,
      'Prioridade': ticket.priority,
      'Categoria': ticket.category,
      'Status': ticket.status,
      'Criado por': ticket.submittedBy,
      'Atribuído a': ticket.assignedTo || 'Não atribuído',
      'Data de Criação': ticket.createdAt.toLocaleDateString('pt-BR'),
      'Última Atualização': ticket.updatedAt.toLocaleDateString('pt-BR')
    }));

    // Criar CSV (simulação)
    const headers = Object.keys(filteredData[0] || {}).join(',');
    const rows = filteredData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    // Criar e baixar arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chamados_ti_${new Date().toLocaleDateString('pt-BR')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Dados exportados com sucesso!');
  };

  // Aplicar filtros
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesPriority = !filters.priority || ticket.priority === filters.priority;
      const matchesCategory = !filters.category || ticket.category === filters.category;
      const matchesAssignedTo = !filters.assignedTo || ticket.assignedTo === filters.assignedTo;
      const matchesSearch = !filters.search || 
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.id.includes(filters.search);

      // Filtro de data (corrigido)
      let matchesDate = true;
      if (filters.dateRange) {
        const now = new Date();
        const ticketDate = ticket.createdAt;
        
        switch (filters.dateRange) {
          case 'today':
            matchesDate = ticketDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            matchesDate = ticketDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            matchesDate = ticketDate >= monthAgo;
            break;
        }
      }

      return matchesStatus && matchesPriority && matchesCategory && 
             matchesAssignedTo && matchesSearch && matchesDate;
    });
  }, [tickets, filters]);

  // Opções únicas para filtros
  const uniqueStatuses = [...new Set(tickets.map(t => t.status))];
  const uniquePriorities = [...new Set(tickets.map(t => t.priority))];
  const uniqueCategories = [...new Set(tickets.map(t => t.category))];
  const uniqueAssignees = [...new Set(tickets.map(t => t.assignedTo))];

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      assignedTo: '',
      dateRange: '',
      search: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento': return 'bg-blue-100 text-blue-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-orange-100 text-orange-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com busca e ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar chamados..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {Object.values(filters).some(value => value !== '' && value !== 'search') && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Object.values(filters).filter(value => value !== '' && value !== 'search').length}
              </span>
            )}
          </button>
          
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as prioridades</option>
                {uniquePriorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as categorias</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todo período</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Lista de chamados */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Todos os Chamados ({filteredTickets.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atribuído a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{ticket.id}
                      </div>
                      <div className="text-sm text-gray-600 max-w-xs">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Por: {ticket.submittedBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ticket.assignedTo ? ticket.assignedTo.split('@')[0] : 'Não atribuído'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onTicketSelect(ticket)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">Nenhum chamado encontrado</p>
              <p className="text-gray-400 text-sm mt-1">
                {Object.values(filters).some(f => f !== '') 
                  ? 'Tente ajustar os filtros aplicados' 
                  : 'Não há chamados no sistema'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}