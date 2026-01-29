import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, Save, ShieldCheck, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
    const { updatePassword } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
