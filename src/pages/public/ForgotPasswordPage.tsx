import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { generatePasswordResetEmailHtml, createEmailLog } from '../../services/emailService';
import { STORE_INFO } from '../../data/products';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { emailLogs } = useStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      // Simulate token generation and email dispatch
      const resetLink = `${window.location.origin}/login?reset=token_${Date.now()}`;
      const emailHtml = generatePasswordResetEmailHtml('Chère Cliente', resetLink);
      
      // Store in email logs in localStorage
      try {
        const log = createEmailLog(
          email.trim(),
          'Cliente BECCA SHOP',
          'Réinitialisation de votre mot de passe — BECCA SHOP',
          'password_reset',
          emailHtml
        );
        const existing = localStorage.getItem('becca_email_logs');
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem('becca_email_logs', JSON.stringify([log, ...list]));
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0d]">
      <div className="max-w-md w-full space-y-8 bg-[#121218] border border-[#252535] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative gold light */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#e5c158] transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la connexion</span>
          </Link>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-black border border-[#d4af37]/40 flex items-center justify-center p-2 mb-4 shadow-lg shadow-[#d4af37]/20">
            <img
              src={STORE_INFO.logoUrl}
              alt="BECCA SHOP"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h1 className="font-luxury text-2xl font-bold text-white tracking-tight">
            Mot de passe oublié ?
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-2">
            Entrez votre adresse email ci-dessous pour recevoir les instructions sécurisées de réinitialisation.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 bg-[#171622] border border-[#2c2b3d] rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Email envoyé avec succès</h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Si un compte existe pour <span className="text-[#e5c158] font-medium">{email}</span>, vous recevrez un email instantané contenant les instructions de récupération.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full block py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all text-center"
              >
                Retourner à la page de connexion
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                Adresse email enregistrée
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#71717a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: clarisse@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#171720] border border-[#2e2e40] rounded-xl text-white text-xs placeholder-[#71717a] outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}</span>
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717a] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Lien sécurisé et crypté à usage unique</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
