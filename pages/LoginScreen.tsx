import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Activity, CheckCircle, Mail, Lock, Eye, EyeOff, ArrowRight, Check, ShieldCheck, User, AlertCircle } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Determinar si empezamos en modo registro o login según lo que venga de la Landing
  const [isRegister, setIsRegister] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, resetPassword } = useAuth();

  useEffect(() => {
    // Si viene un modo específico en el estado de la navegación, lo aplicamos
    if (location.state && location.state.mode === 'login') {
      setIsRegister(false);
    } else if (location.state && location.state.mode === 'register') {
      setIsRegister(true);
    }
  }, [location]);

  // Estados del formulario y errores
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error al escribir
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex: Mínimo 8 chars, 1 mayúscula, 1 número, 1 símbolo especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (isRegister) {
      if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido.";
      if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido.";
      if (!formData.agreedToTerms) newErrors.agreedToTerms = "Debes aceptar los términos.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (isRegister && !passwordRegex.test(formData.password)) {
      newErrors.password = "La contraseña debe tener mayúscula, número y símbolo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Validación para recuperación
    if (isRecovery) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setAuthError("Ingresa un correo válido.");
        return;
      }
      setLoading(true);
      try {
        await resetPassword(formData.email);
        alert("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
        setIsRecovery(false); // Volver al login
      } catch (err: any) {
        setAuthError(err.message || "Error al enviar correo.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (validateForm()) {
      setLoading(true);
      try {
        if (isRegister) {
          await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          });
        } else {
          await login(formData.email, formData.password);
        }

        // Solo navegamos si no hubo error
        navigate('/dashboard');
      } catch (err: any) {
        console.error("Error de autenticación:", err);
        setAuthError(err.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreedToTerms: false
    });
  };

  const handleSocialLogin = (provider: string) => {
    // Simular login social creando un usuario
    if (isRegister) {
      register({ firstName: 'Usuario', lastName: provider, email: `user@${provider}.com` });
    } else {
      login(`user@${provider}.com`);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100">
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-primary">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">MiRegistro Medico Digital</h2>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMode}
              className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-primary hover:underline transition-all focus:outline-none"
            >
              {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
            </button>
            <button
              onClick={toggleMode}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors"
            >
              <span className="truncate">{isRegister ? "Iniciar Sesión" : "Registrarse"}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img alt="Profesional médico revisando registros digitales de salud" className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7H1sQ8D9vWsqjb4tvHLYUZHqhVQAK_OIx9J9dtbEyHtA4E4ffUpqiHPgcn5PlwMSpBEm4fpTEvuSGEJbs3-vKfu7aww35jb4VnwtjZfK98M0rsUJixqql3QvViaQB5TGAaAdw9L8pIGcTvJ9ghb1Qs-hVcrxGEW3qgHLQtj-VBDDOhGVK9gcsM9eER-D2Vtc5GsfzNDXo5tDe5hibJdMA3FozjZbdpjH3bXOj--jY-TkG7OyhyMJPoNFI1nRna-8Z5vvdP8SPAxE" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-slate-900/90 mix-blend-multiply"></div>
          </div>
          <div className="relative z-10 p-12 flex flex-col h-full justify-center text-white max-w-xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl backdrop-blur-sm mb-6 border border-white/10">
                <Activity className="w-8 h-8" />
              </div>
              <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight mb-6">
                Gestión Segura de Salud Familiar
              </h1>
              <p className="text-lg text-slate-200 font-medium leading-relaxed mb-8">
                Únete a miles de familias que gestionan su historial médico en un lugar seguro. Accede a registros de vacunación, recetas e historial en cualquier momento y lugar.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold">Seguridad conforme a HIPAA y GDPR</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold">Acceso a especialistas en tiempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold">Panel familiar unificado</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 p-8 text-xs text-slate-400 border-t border-white/10 flex justify-between">
            <span>© 2024 MiRegistro Medico Digital</span>
            <span>Privacidad y Términos</span>
          </div>
        </div>
        <div className="w-full lg:w-7/12 xl:w-1/2 bg-background-light dark:bg-background-dark flex flex-col justify-center py-10 px-4 sm:px-12 md:px-20 lg:px-16 xl:px-24 overflow-y-auto">
          <div className="max-w-[560px] mx-auto w-full">
            <div className="mb-8">
              {isRegister ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  Administrador Familiar
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <User className="w-4 h-4" />
                  Bienvenido de nuevo
                </div>
              )}

              <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-2">
                {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                {isRegister
                  ? "Comienza a gestionar el historial de salud de tu familia hoy."
                  : "Accede a tu panel de control y gestiona tus citas médicas."}
              </p>

              {authError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{authError}</p>
                </div>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {isRegister && !isRecovery && (
                <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex-1 space-y-2">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold" htmlFor="firstName">Nombre</label>
                    <input
                      className={`w-full h-12 px-4 rounded-lg border ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-primary'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
                      id="firstName"
                      placeholder="Maria"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.firstName}</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold" htmlFor="lastName">Apellido</label>
                    <input
                      className={`w-full h-12 px-4 rounded-lg border ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-primary'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
                      id="lastName"
                      placeholder="Rodriguez"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.lastName}</span>}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold" htmlFor="email">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    className={`w-full h-12 pl-11 pr-4 rounded-lg border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-primary'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
                    id="email"
                    placeholder="maria.rodriguez@ejemplo.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</span>}
              </div>

              {!isRecovery && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold" htmlFor="password">Contraseña</label>
                    {!isRegister && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClickCapture={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Recovery span clicked (Capture phase)");
                          setIsRecovery(true);
                          setAuthError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsRecovery(true);
                            setAuthError(null);
                          }
                        }}
                        className="text-xs font-bold text-primary hover:underline focus:outline-none cursor-pointer select-none"
                      >
                        Recuperar Contraseña
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-3.5 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      className={`w-full h-12 pl-11 pr-11 rounded-lg border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-primary'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
                      id="password"
                      placeholder={isRegister ? "Mínimo 8 caracteres" : "Ingresa tu contraseña"}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-1"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {errors.password && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</span>}

                  {isRegister && (
                    <>
                      <div className="flex gap-1 h-1 mt-2">
                        <div className={`flex-1 rounded-full transition-colors ${formData.password.length > 0 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`flex-1 rounded-full transition-colors ${formData.password.length > 4 ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`flex-1 rounded-full transition-colors ${formData.password.length > 7 ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`flex-1 rounded-full transition-colors ${formData.password.length > 9 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Asegúrate de que tenga al menos 8 caracteres, incluyendo un número y un símbolo.
                      </p>
                    </>
                  )}
                </div>
              )}

              {isRegister && !isRecovery && (
                <div className="space-y-3 pt-2 animate-in fade-in duration-300">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        id="agreedToTerms"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:bg-primary checked:border-primary transition-all"
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                      />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight pt-0.5">
                      Acepto los <button type="button" className="text-primary hover:underline font-semibold bg-transparent border-none cursor-pointer p-0 inline" onClick={(e) => e.preventDefault()}>Términos de Servicio</button> y la <button type="button" className="text-primary hover:underline font-semibold bg-transparent border-none cursor-pointer p-0 inline" onClick={(e) => e.preventDefault()}>Política de Privacidad</button>.
                    </span>
                  </label>
                  {errors.agreedToTerms && <span className="text-xs text-red-500 flex items-center gap-1 block ml-8 mt-1"><AlertCircle className="w-3 h-3" /> {errors.agreedToTerms}</span>}
                </div>
              )}

              <button
                className={`w-full h-12 ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'} text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform ${!loading && 'hover:-translate-y-0.5'} flex items-center justify-center gap-2`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRecovery ? "Enviar correo de recuperación" : (isRegister ? "Crear Cuenta" : "Iniciar Sesión")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {isRecovery && (
                <button
                  type="button"
                  onClick={() => setIsRecovery(false)}
                  className="w-full h-10 mt-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              )}
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background-light dark:bg-background-dark px-2 text-slate-500">O continuar con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 px-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 dark:text-white">Google</span>
              </button>
              <button onClick={() => handleSocialLogin('apple')} className="flex items-center justify-center gap-3 px-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
                <svg className="h-5 w-5 text-white dark:text-black" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                <span className="text-sm font-semibold text-white dark:text-slate-900">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
              <button
                onClick={toggleMode}
                className="text-primary font-bold hover:underline ml-1"
              >
                {isRegister ? "Iniciar Sesión" : "Regístrate"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;