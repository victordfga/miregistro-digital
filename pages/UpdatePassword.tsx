import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Lock, Eye, EyeOff, Save, ShieldCheck, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
    const { updatePassword } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [restoringSession, setRestoringSession] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionReady, setSessionReady] = useState(false);

    // Restaurar sesión desde el hash guardado por index.tsx o verificar sesión existente
    useEffect(() => {
        let mounted = true;

        const restoreSession = async () => {
            console.log('[UpdatePassword] Iniciando restauración de sesión...');

            // Primero verificar si ya hay una sesión activa (por si Supabase ya la procesó)
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession) {
                console.log('[UpdatePassword] Sesión existente detectada');
                if (mounted) {
                    setSessionReady(true);
                    setRestoringSession(false);
                }
                return;
            }

            // Intentar restaurar desde sessionStorage
            const savedUrl = sessionStorage.getItem('supabase_recovery_url');
            const savedHash = sessionStorage.getItem('supabase_recovery_hash');

            console.log('[UpdatePassword] savedUrl:', savedUrl);
            console.log('[UpdatePassword] savedHash:', savedHash);

            if (savedUrl || savedHash) {
                console.log('[UpdatePassword] Restaurando sesión desde datos guardados');
                sessionStorage.removeItem('supabase_recovery_url');
                sessionStorage.removeItem('supabase_recovery_hash');

                const sourceString = savedUrl || savedHash || '';

                // Buscar access_token y refresh_token
                const accessTokenMatch = sourceString.match(/access_token=([^&#]+)/);
                const refreshTokenMatch = sourceString.match(/refresh_token=([^&#]+)/);

                const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
                const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

                console.log('[UpdatePassword] Access token encontrado:', accessToken ? 'Sí' : 'No');
                console.log('[UpdatePassword] Refresh token encontrado:', refreshToken ? 'Sí' : 'No');

                if (accessToken) {
                    try {
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || ''
                        });
                        if (error) {
                            console.error('[UpdatePassword] Error al restaurar sesión:', error);
                            if (mounted) setError('El enlace de recuperación ha expirado. Por favor solicita uno nuevo.');
                        } else {
                            console.log('[UpdatePassword] Sesión restaurada exitosamente:', data.session ? 'Sí' : 'No');
                            if (mounted) setSessionReady(true);
                        }
                    } catch (err) {
                        console.error('[UpdatePassword] Excepción al restaurar sesión:', err);
                        if (mounted) setError('Error al verificar el enlace de recuperación.');
                    }
                } else {
                    console.warn('[UpdatePassword] No se encontró access_token en los datos guardados');
                    // Mostrar formulario de todas formas, el usuario puede que tenga sesión por otro medio
                    if (mounted) setSessionReady(true);
                }
            } else {
                console.log('[UpdatePassword] No hay datos guardados en sessionStorage');
                // Si no hay datos guardados, verificar si llegamos aquí por otro medio
                if (mounted) setSessionReady(true);
            }

            if (mounted) setRestoringSession(false);
        };

        // Timeout de seguridad: si después de 5 segundos no termina, mostrar el formulario
        const timeoutId = setTimeout(() => {
            console.warn('[UpdatePassword] Timeout alcanzado, mostrando formulario de todas formas');
            if (mounted) {
                setRestoringSession(false);
                setSessionReady(true);
            }
        }, 5000);

        restoreSession();

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación simple
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("La contraseña debe tener 8+ caracteres, mayúscula, número y símbolo.");
            return;
        }

        setLoading(true);
        try {
            await updatePassword(password);
            alert("Contraseña actualizada con éxito.");
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || "Error al actualizar contraseña.");
        } finally {
            setLoading(false);
        }
    };

    if (restoringSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Verificando enlace de recuperación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 transform transition-all">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nueva Contraseña</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Por seguridad, ingresa una nueva contraseña para tu cuenta.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirmar Contraseña</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Actualizar Contraseña
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
