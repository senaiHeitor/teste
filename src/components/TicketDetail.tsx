import { useState } from 'react';
import { Ticket } from './TicketForm';
import { ArrowLeft, MessageSquare, Calendar, User, Tag, AlertCircle, Send } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  userRole: 'client' | 'it-executive';
  userEmail: string;
  onBack: () => void;
  onAddComment: (ticketId: string, comment: string, isInternal: boolean) => void;
  onStatusUpdate: (ticketId: string, status: Ticket['status']) => void;
  onAssignTicket: (ticketId: string, assignee: string) => void;
}

export function TicketDetail({ 
  ticket, 
  userRole, 
  userEmail, 
  onBack, 
  onAddComment, 
  onStatusUpdate, 
  onAssignTicket 
}: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

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
      case 'urgente': return 'bg-red-100 text-red-800 border border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border border-green-200';
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(ticket.id, newComment.trim(), isInternalComment);
    setNewComment('');
    setIsInternalComment(false);
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

  // Filter comments based on user role
  const visibleComments = ticket.comments.filter(comment => {
    if (userRole === 'it-executive') return true; // IT executives see all comments
    return !comment.isInternal; // Clients only see public comments
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos chamados
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusText(ticket.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
              {getPriorityText(ticket.priority)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Descrição</h2>
            </div>
            <div className="p-6">
              <p className="whitespace-pre-wrap text-gray-700">{ticket.description}</p>
            </div>
          </div>

          {/* Comments Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentários ({visibleComments.length})
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {visibleComments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum comentário registrado no momento</p>
              ) : (
                visibleComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        {comment.isInternal && userRole === 'it-executive' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-300">
                            Interno
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <textarea
                    placeholder="Adicionar comentários..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {userRole === 'it-executive' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternalComment}
                            onChange={(e) => setIsInternalComment(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Comentário Interno (visível apenas para o TI)</span>
                        </label>
                      )}
                    </div>
                    
                    <button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      Adicionar comentário
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Ticket Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informações do Chamado</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Categoria:</span>
                <span className="text-gray-900">{ticket.category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Enviado por:</span>
                <span className="text-gray-900">{ticket.submittedBy}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Criado em:</span>
                <span className="text-gray-900">{formatDate(ticket.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Atualizado em:</span>
                <span className="text-gray-900">{formatDate(ticket.updatedAt)}</span>
              </div>
              
              {ticket.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Designado para:</span>
                  <span className="text-gray-900">{ticket.assignedTo}</span>
                </div>
              )}
            </div>
          </div>

          {userRole === 'it-executive' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Atividades</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => onStatusUpdate(ticket.id, e.target.value as Ticket['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>

                {!ticket.assignedTo && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Designar para</label>
                    <select 
                      onChange={(e) => onAssignTicket(ticket.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="">Selecionar responsável</option>
                      {itExecutives.map((exec) => (
                        <option key={exec} value={exec}>
                          {exec.split('@')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {userRole === 'client' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Necessita de ajuda urgente?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Se precisar de ajuda urgente, entre em contato diretamente com o TI suporteTi@empresa.com!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}