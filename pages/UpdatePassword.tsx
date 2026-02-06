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
    const [restoringSession, setRestoringSession] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionReady, setSessionReady] = useState(false);

    // Restaurar sesión usando los tokens guardados por el interceptor
    useEffect(() => {
        let mounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;

        const restoreSession = async () => {
            console.log('[UpdatePassword] Iniciando restauración de sesión...');

            try {
                // Primero verificar si ya hay una sesión activa
                const { data: { session: existingSession } } = await supabase.auth.getSession();
                if (existingSession) {
                    console.log('[UpdatePassword] ✅ Sesión existente detectada');
                    if (mounted) {
                        setSessionReady(true);
                        setRestoringSession(false);
                    }
                    return;
                }

                // Verificar si hay tokens guardados por el interceptor
                const accessToken = sessionStorage.getItem('recovery_access_token');
                const refreshToken = sessionStorage.getItem('recovery_refresh_token');
                const pendingRecovery = sessionStorage.getItem('recovery_pending');

                console.log('[UpdatePassword] Tokens en sessionStorage:', accessToken ? 'Sí' : 'No');
                console.log('[UpdatePassword] Recovery pending:', pendingRecovery ? 'Sí' : 'No');

                if (accessToken && pendingRecovery) {
                    // Limpiar sessionStorage ANTES de intentar setSession
                    sessionStorage.removeItem('recovery_access_token');
                    sessionStorage.removeItem('recovery_refresh_token');
                    sessionStorage.removeItem('recovery_pending');

                    console.log('[UpdatePassword] Llamando a setSession (con timeout de 8s)...');

                    // Usar Promise.race con timeout para evitar bloqueo infinito
                    const setSessionPromise = supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    });

                    const timeoutPromise = new Promise<{ data: { session: null }, error: Error }>((resolve) => {
                        timeoutId = setTimeout(() => {
                            console.warn('[UpdatePassword] ⚠️ Timeout de 8s alcanzado en setSession');
                            resolve({
                                data: { session: null },
                                error: new Error('La verificación tardó demasiado. Intenta actualizar la contraseña de todos modos.')
                            });
                        }, 8000);
                    });

                    const result = await Promise.race([setSessionPromise, timeoutPromise]);
                    clearTimeout(timeoutId);

                    if (result.error && result.error.message.includes('tardó demasiado')) {
                        // Timeout - mostrar formulario con advertencia pero permitir intentar
                        console.warn('[UpdatePassword] Timeout - mostrando formulario de todas formas');
                        if (mounted) {
                            setError('La verificación tardó demasiado. Puedes intentar actualizar tu contraseña de todos modos.');
                            setSessionReady(true); // Mostrar el formulario
                            setRestoringSession(false);
                        }
                        return;
                    }

                    if (result.error) {
                        console.error('[UpdatePassword] Error al restaurar sesión:', result.error);
                        if (mounted) {
                            setError('El enlace de recuperación ha expirado o es inválido. Por favor solicita uno nuevo.');
                            setRestoringSession(false);
                        }
                        return;
                    }

                    if (result.data.session) {
                        console.log('[UpdatePassword] ✅ Sesión restaurada exitosamente');
                        if (mounted) {
                            setSessionReady(true);
                            setRestoringSession(false);
                        }
                        return;
                    } else {
                        console.error('[UpdatePassword] setSession no retornó sesión');
                        if (mounted) {
                            setError('No se pudo establecer la sesión. Por favor solicita un nuevo enlace.');
                            setRestoringSession(false);
                        }
                        return;
                    }
                } else {
                    console.log('[UpdatePassword] No hay tokens de recuperación guardados');
                    if (mounted) {
                        setError('No se encontró información de recuperación. Por favor solicita un nuevo enlace.');
                        setRestoringSession(false);
                    }
                }
            } catch (err) {
                console.error('[UpdatePassword] Excepción:', err);
                if (mounted) {
                    setError('Error inesperado. Por favor intenta nuevamente.');
                    setRestoringSession(false);
                }
            }
        };

        restoreSession();

        return () => {
            mounted = false;
            if (timeoutId) clearTimeout(timeoutId);
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
            // Verificar sesión con timeout
            console.log('[UpdatePassword] Verificando sesión...');
            const sessionPromise = supabase.auth.getSession();
            const sessionTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout verificando sesión')), 5000)
            );

            let session;
            try {
                const result = await Promise.race([sessionPromise, sessionTimeout]) as any;
                session = result.data?.session;
            } catch (timeoutErr) {
                console.error('[UpdatePassword] Timeout al verificar sesión');
                setError("La verificación de sesión tardó demasiado. Intenta nuevamente.");
                setLoading(false);
                return;
            }

            console.log('[UpdatePassword] Sesión:', session ? 'Activa' : 'No existe');

            if (!session) {
                setError("No hay sesión activa. El enlace puede haber expirado. Por favor solicita uno nuevo.");
                setLoading(false);
                return;
            }

            // Actualizar contraseña con timeout
            console.log('[UpdatePassword] Llamando a updateUser...');
            const updatePromise = supabase.auth.updateUser({ password });
            const updateTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout actualizando contraseña')), 10000)
            );

            let updateResult;
            try {
                updateResult = await Promise.race([updatePromise, updateTimeout]) as any;
            } catch (timeoutErr) {
                console.error('[UpdatePassword] Timeout al actualizar contraseña');
                setError("La actualización tardó demasiado. Intenta nuevamente.");
                setLoading(false);
                return;
            }

            if (updateResult.error) {
                console.error('[UpdatePassword] Error:', updateResult.error);
                throw updateResult.error;
            }

            console.log('[UpdatePassword] ✅ Contraseña actualizada exitosamente');

            // Cerrar sesión para que inicie con nueva contraseña
            await supabase.auth.signOut();

            alert("¡Contraseña actualizada con éxito! Inicia sesión con tu nueva contraseña.");
            navigate('/login');
        } catch (err: any) {
            console.error('[UpdatePassword] Excepción:', err);
            setError(err.message || "Error al actualizar contraseña.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
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
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
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
                            {!sessionReady && (
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

                {sessionReady ? (
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
