import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Phone, ArrowRight, Play } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10"
          >
            {/* Colorful top border bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/30">
                  <Phone size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 tracking-tight">
                    O Método do Telefone de Disco!
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Aprenda Mandarim com a mecânica cinestésica tátil
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Steps */}
            <div className="p-6 pt-2 space-y-5">
              
              {/* Concept Intro */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                💡 <strong>A Analogia:</strong> No século passado, discávamos números de telefone puxando o disco rotativo até o batente final e soltando-o. Neste app, você <strong>"disca" ideogramas</strong> puxando-os até o círculo central para formar frases em chinês!
              </div>

              {/* Step 1 */}
              <div className="flex gap-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Arraste Ideogramas</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Identifique a palavra certa que flutua na tela e arraste-a com o dedo ou mouse até a <strong>Zona Central</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Monte a Sequência Correta</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Arraste as palavras subsequentes na ordem correta da frase. Caso erre, o disco central vibrará e devolverá as palavras ao campo flutuante.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Colecione e Domine</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Frases montadas com sucesso são enviadas à sua biblioteca lateral! Lá você desbloqueia o <strong>Áudio falado original em Mandarim</strong>, explicações de cada caractere e ganha XP de conquistas!
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
              >
                Começar Treinamento
                <Play size={12} fill="currentColor" />
              </button>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
