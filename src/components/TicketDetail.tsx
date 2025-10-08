import { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Calendar, 
  Mail, 
  Paperclip,
  Computer,
  MapPin,
  AlertTriangle,
  PlayCircle,
  CheckCircle,
  XCircle,
  Send,
  Download,
  Eye,
  FileText,
  Image
} from 'lucide-react';
import { Ticket } from './TicketForm';

interface TicketDetailProps {
  ticket: Ticket;
  userRole: 'client' | 'analyst';
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
  const [isInternal, setIsInternal] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'em-andamento': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'resolvido': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fechado': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'em-andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolvido': return 'bg-green-100 text-green-800 border-green-200';
      case 'fechado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(ticket.id, newComment.trim(), isInternal);
    setNewComment('');
    setIsInternal(false);
  };

  const renderAttachments = () => {
    if (!ticket.attachments || ticket.attachments.length === 0) {
      return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Paperclip className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Anexos</p>
            <p className="text-gray-700">Nenhum arquivo anexado</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Paperclip className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Anexos</p>
            <p className="text-gray-700">{ticket.attachments.length} arquivo(s)</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {ticket.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                {attachment.type.startsWith('image/') ? (
                  <Image className="h-8 w-8 text-blue-600" />
                ) : (
                  <FileText className="h-8 w-8 text-gray-600" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(attachment.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Visualizar arquivo"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = attachment.url;
                    link.download = attachment.name;
                    link.click();
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEquipmentInfo = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Computer className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">Categoria</p>
          <p className="text-gray-700">{ticket.category}</p>
        </div>
      </div>

      {ticket.equipmentNumber && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Computer className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Número do Patrimônio</p>
            <p className="text-gray-700 font-mono">{ticket.equipmentNumber}</p>
          </div>
        </div>
      )}

      {ticket.location && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <MapPin className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Localização</p>
            <p className="text-gray-700">{ticket.location}</p>
          </div>
        </div>
      )}
    </div>
  );

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

  // Filter comments based on user role
  const visibleComments = ticket.comments.filter(comment => {
    if (userRole === 'analyst') return true;
    return !comment.isInternal;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalhes do Chamado</h1>
              <p className="text-gray-600">ID: {ticket.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Informações do Chamado */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Principais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{ticket.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 capitalize">
                        {getStatusText(ticket.status)}
                      </span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                      <span className="capitalize">
                        {getPriorityText(ticket.priority)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Problema</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
                </div>
              </div>

              {/* Informações Detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informações do Equipamento</h4>
                  {renderEquipmentInfo()}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informações do Chamado</h4>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Solicitante</p>
                      <p className="text-gray-700">{ticket.submittedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data de Criação</p>
                      <p className="text-gray-700">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Atribuído para</p>
                      <p className="text-gray-700">{ticket.assignedTo || 'Não atribuído'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Anexos */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Arquivos Anexados</h4>
                {renderAttachments()}
              </div>
            </div>

            {/* Área de Conversa */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header da Conversa */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversa do Chamado
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {visibleComments.length} mensagem(ns) trocada(s)
                </p>
              </div>

              {/* Lista de Mensagens */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {visibleComments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma mensagem ainda.</p>
                    <p className="text-gray-400 text-sm">Seja o primeiro a comentar!</p>
                  </div>
                ) : (
                  visibleComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex ${comment.author === userEmail ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                          comment.author === userEmail
                            ? 'bg-blue-600 text-white'
                            : comment.isInternal
                            ? 'bg-purple-100 border border-purple-200'
                            : 'bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            comment.author === userEmail
                              ? 'text-blue-100'
                              : comment.isInternal
                              ? 'text-purple-800'
                              : 'text-gray-800'
                          }`}>
                            {comment.author === userEmail ? 'Você' : comment.author}
                            {comment.isInternal && ' (Interno)'}
                          </span>
                          <span className={`text-xs ${
                            comment.author === userEmail
                              ? 'text-blue-200'
                              : comment.isInternal
                              ? 'text-purple-600'
                              : 'text-gray-600'
                          }`}>
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className={`${
                          comment.author === userEmail
                            ? 'text-white'
                            : comment.isInternal
                            ? 'text-purple-900'
                            : 'text-gray-700'
                        }`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input de Mensagem */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between">
                    {userRole === 'analyst' && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Comentário interno (só visível para TI)</span>
                      </label>
                    )}
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Ações e Status */}
          <div className="space-y-6">
            {/* Card de Ações */}
            {userRole === 'analyst' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações do Chamado</h3>
                
                <div className="space-y-4">
                  {/* Atualizar Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atualizar Status
                    </label>
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

                  {/* Atribuir Chamado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atribuir para
                    </label>
                    <input
                      type="email"
                      value={ticket.assignedTo || ''}
                      onChange={(e) => onAssignTicket(ticket.id, e.target.value)}
                      placeholder="tecnico@empresa.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card de Resumo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo aberto:</span>
                  <span className="font-medium">
                    {Math.floor((new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última atualização:</span>
                  <span className="font-medium">{formatDate(ticket.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mensagens:</span>
                  <span className="font-medium">{visibleComments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arquivos:</span>
                  <span className="font-medium">{ticket.attachments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}