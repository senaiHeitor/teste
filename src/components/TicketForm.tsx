import { useState } from 'react';
import { AlertCircle, Plus, Paperclip, Computer, Lightbulb } from 'lucide-react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  category: string;
  status: 'aberto' | 'em-andamento' | 'resolvido' | 'fechado';
  submittedBy: string;
  assignedTo?: string;
  assignedAt?: Date; // Nova propriedade - quando foi atribuído
  createdAt: Date;
  updatedAt: Date;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    isInternal: boolean;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  equipmentNumber?: string;
  location?: string;
  slaDeadline?: Date;
}

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments' | 'assignedAt' | 'slaDeadline'>) => void;
  userEmail: string;
}

export function TicketForm({ onSubmit, userEmail }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'urgente'>('media');
  const [category, setCategory] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [location, setLocation] = useState('');
  const [showTips, setShowTips] = useState(false);

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

  const locations = [
    'Sede Principal',
    'Filial Centro',
    'Filial Zona Norte', 
    'Home Office',
    'Outro'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) return;

    // Converter arquivos para o formato de anexos
    const ticketAttachments = attachments.map((file, index) => ({
      id: `file-${index}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      submittedBy: userEmail,
      attachments: ticketAttachments,
      equipmentNumber: equipmentNumber.trim(),
      location: location
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('media');
    setCategory('');
    setAttachments([]);
    setEquipmentNumber('');
    setLocation('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-gray-900">
                Envie um novo chamado para a equipe de TI
              </h2>
            </div>
            
            {/* Emoji de dicas */}
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-2 px-3 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">💡 Dicas</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Preencha os campos abaixo com as informações detalhadas do seu problema
          </p>

          {/* Dicas expandidas */}
          {showTips && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-3">
                💡 Para um atendimento mais rápido:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Inclua mensagens de erro completas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Informe o modelo do equipamento quando possível</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Descreva o que você estava fazendo quando o problema ocorreu</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mencione se o problema acontece em outros computadores</span>
                </li>
              </ul>
            </div>
          )}
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
                placeholder="Ex: Computador não liga, Erro ao acessar sistema X, Impressora sem conexão"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Localização e Número do Equipamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Localização
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione sua localização</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="equipmentNumber" className="block text-sm font-medium text-gray-700">
                  <Computer className="h-4 w-4 inline mr-1" />
                  Número do Patrimônio (opcional)
                </label>
                <input
                  id="equipmentNumber"
                  type="text"
                  value={equipmentNumber}
                  onChange={(e) => setEquipmentNumber(e.target.value)}
                  placeholder="Número do patrimônio do equipamento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category and Priority Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Categoria #
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
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
                  onChange={(e) => setPriority(e.target.value as 'baixa' | 'media' | 'alta' | 'urgente')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição Detalhada 
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Descreva detalhadamente o problema incluindo:
• O que está acontecendo
• Quando começou o problema
• Passo a passo para reproduzir o erro
• Mensagens de erro exatas
• O que você já tentou fazer para resolver`}
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            {/* Anexos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Paperclip className="h-4 w-4 inline mr-1" />
                Anexos (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-gray-800 py-4"
                >
                  <Paperclip className="h-8 w-8 mb-2" />
                  <span className="text-sm">Clique para adicionar arquivos ou arraste aqui</span>
                  <span className="text-xs text-gray-500 mt-1">Máx. 5 arquivos • PDF, PNG, JPG</span>
                </label>
              </div>
              
              {/* Lista de arquivos anexados */}
              {attachments.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Arquivos anexados:</h4>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Informações importantes</p>
                <p className="text-sm text-blue-700 mt-1">
                  Para problemas urgentes que afetam a operação da empresa, 
                  entre em contato também por telefone: <strong>(32) 99851-7766</strong>
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!title || !description || !category}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar chamado
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}