import { useState } from "react";

interface LoginProps {
  onLogin: (email: string, role: "client" | "it-executive") => void;
}

type UserRole = "client" | "it-executive";

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    // Simulação de requisição de login
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(email, role);
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    client: {
      label: "Cliente",
      icon: (
        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      activeClass: "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25",
      inactiveClass: "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
    },
    "it-executive": {
      label: "Analista TI",
      icon: (
        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      activeClass: "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/25",
      inactiveClass: "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Login Card */}
      <div 
        className="w-full max-w-[440px] backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl relative z-10"
      >
        {/* Card Header */}
        <div className="text-center space-y-4 pb-2 pt-8 px-8">
          {/* Logo */}
          <div className="flex justify-center" aria-hidden="true">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            TechSupport
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Entre no seu painel de suporte
          </p>
        </div>

        {/* Card Content */}
        <div className="space-y-6 pt-4 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 h-12 bg-white/5 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 h-12 bg-white/5 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Role Selector */}
            <fieldset className="space-y-3" disabled={isLoading}>
              <legend className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Acesso
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(([roleKey, config]) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setRole(roleKey)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      role === roleKey ? config.activeClass : config.inactiveClass
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-center">
                      {config.icon}
                      <span className="text-sm font-medium block">{config.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </div>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="text-center space-y-3">
            <a 
              href="#" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-md"
            >
              Esqueceu sua senha?
            </a>
            <div className="text-xs text-gray-500">
              Precisa de ajuda?{" "}
              <a 
                href="#" 
                className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-md"
              >
                Contate o suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}