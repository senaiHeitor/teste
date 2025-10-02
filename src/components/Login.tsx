import { useState } from "react";
import logoImage from "../assets/icon test blue simple.png";

interface LoginProps {
  onLogin: (email: string, role: "client" | "it-executive") => void;
}

type UserRole = "client" | "it-executive";

export function Login({ onLogin }: LoginProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      if (!nome || !email || !password || !confirmPassword) {
        alert("Preencha todos os campos!");
        return;
      }
      if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }
      if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
      }
    } else {
      if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
      }
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(email, role);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setNome("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      {/* Card Principal - Compacto */}
      <div className="w-full max-w-md bg-white border border-blue-100 shadow-xl rounded-2xl">
        
        {/* Header Compacto */}
        <div className="text-center py-6 px-8">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <img 
                src={logoImage} 
                alt="Logo SuporteTI" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            SuporteTI
          </h1>
          <p className="text-gray-600 text-sm">
            {isRegistering ? "Crie sua conta" : "Entre no seu painel"}
          </p>
        </div>

        {/* Formulário Compacto */}
        <div className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome (apenas cadastro) */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 text-sm"
                />
              </div>
            )}
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full h-10 px-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 text-sm"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder={isRegistering ? "Mínimo 6 caracteres" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full h-10 px-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 text-sm"
              />
            </div>

            {/* Confirmar Senha (apenas cadastro) */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite novamente sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 text-sm"
                />
              </div>
            )}

            {/* Tipo de Acesso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Acesso
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    role === "client" 
                      ? "border-blue-500 bg-blue-500/20 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium">Cliente</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole("it-executive")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    role === "it-executive" 
                      ? "border-blue-500 bg-blue-500/20 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="text-xs font-medium">Analista TI</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Botão Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isRegistering ? "Cadastrando..." : "Entrando..."}
                </div>
              ) : (
                isRegistering ? "Cadastrar-se" : "Entrar no Sistema"
              )}
            </button>
          </form>

          {/* Links Adicionais Compactos */}
          <div className="text-center mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600 text-sm">
                {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}
              </span>
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {isRegistering ? "Fazer Login" : "Cadastre-se"}
              </button>
            </div>
            
            {!isRegistering && (
              <a href="#" className="text-blue-600 hover:text-blue-800 text-xs block">
                Esqueceu sua senha?
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}