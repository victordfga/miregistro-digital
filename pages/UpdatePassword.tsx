import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Lock, Eye, EyeOff, Save, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasValidSession, setHasValidSession] = useState(false);

    // Verificar si hay una sesión válida para actualizar contraseña
    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            console.log('[UpdatePassword] Verificando sesión...');

            // Dar tiempo a Supabase para procesar los tokens del hash
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    console.log('[UpdatePassword] ✅ Sesión válida encontrada');
                    if (mounted) {
                        setHasValidSession(true);
                        setCheckingSession(false);
                    }
                } else {
                    console.log('[UpdatePassword] ❌ No hay sesión activa');
                    // Verificar si hay un flag de recuperación pendiente
                    const pendingRecovery = sessionStorage.getItem('pending_password_recovery');
                    if (pendingRecovery) {
                        sessionStorage.removeItem('pending_password_recovery');
                        console.log('[UpdatePassword] Había recuperación pendiente pero no se estableció sesión');
                    }

                    if (mounted) {
                        setError('No se encontró una sesión activa. Por favor solicita un nuevo enlace de recuperación.');
                        setCheckingSession(false);
                    }
                }
            } catch (err) {
                console.error('[UpdatePassword] Error al verificar sesión:', err);
                if (mounted) {
                    setError('Error al verificar la sesión. Por favor intenta nuevamente.');
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación
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
        console.log('[UpdatePassword] Actualizando contraseña...');

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                console.error('[UpdatePassword] Error:', updateError);
                throw updateError;
            }

            console.log('[UpdatePassword] ✅ Contraseña actualizada exitosamente');

            // Cerrar sesión para que el usuario inicie con la nueva contraseña
            await supabase.auth.signOut();

            alert("¡Contraseña actualizada con éxito! Por favor inicia sesión con tu nueva contraseña.");
            navigate('/login');
        } catch (err: any) {
            console.error('[UpdatePassword] Excepción:', err);
            setError(err.message || "Error al actualizar contraseña. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    if (checkingSession) {
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
                        <div>
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            {!hasValidSession && (
                                <button
                                    onClick={handleBackToLogin}
                                    className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                                >
                                    Volver al inicio de sesión
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {hasValidSession ? (
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
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Mínimo 8 caracteres, una mayúscula, un número y un símbolo
                            </p>
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
                ) : (
                    <div className="text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio de sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdatePassword;
