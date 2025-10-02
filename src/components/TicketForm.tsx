import { useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    isInternal: boolean;
  }>;
}

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  userEmail: string;
}

export function TicketForm({ onSubmit, userEmail }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState('');

  const categories = [
    'Hardware',
    'Software',
    'Conexão com Internet',
    'Acessos',
    'Sistemas',
    'Segurança',
    'Impressora',
    'Telefone/Celular',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      submittedBy: userEmail
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Envie um novo chamado para a equipe de TI
        </h2>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Breve Descrição #
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descreva brevemente a sua demanda"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category and Priority Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoria #
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione a categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Prioridade #
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">
                  Baixo
                </option>
                <option value="medium">
                  Médio
                </option>
                <option value="high">
                  Alto
                </option>
                <option value="urgent">
                  Urgente
                </option>
              </select>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição #
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada da sua demanda"
              rows={6}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Info Alert */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Por favor, descreva sua demanda de forma clara e forneça as informações relevantes.
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar chamado
          </button>
        </form>
      </div>
    </div>
  );
}