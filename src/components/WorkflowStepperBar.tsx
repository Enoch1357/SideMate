import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  X,
  TrendingUp,
  Users,
  Layers,
  ShoppingBag,
  Send,
  BarChart3,
  Key
} from 'lucide-react';
import { AppTab } from './Header';
import { WorkflowSession } from '../utils/workflowStorage';

interface WorkflowStepperBarProps {
  currentStage: AppTab;
  session: WorkflowSession;
  onNavigateStage: (stage: AppTab) => void;
  onResetWorkflow: () => void;
}

interface StepMeta {
  id: AppTab;
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKFLOW_STEPS: StepMeta[] = [
  { id: 'discover', stepNumber: 1, label: 'Demand Discovery', shortLabel: '1. Demand', icon: TrendingUp },
  { id: 'creators', stepNumber: 2, label: 'Creator Scout', shortLabel: '2. Creators', icon: Users },
  { id: 'product', stepNumber: 3, label: 'Product Studio', shortLabel: '3. Product', icon: Sparkles },
  { id: 'pricing', stepNumber: 4, label: 'Whop Store & Splits', shortLabel: '4. Whop Store', icon: ShoppingBag },
  { id: 'outreach', stepNumber: 5, label: 'Pitch & Outreach', shortLabel: '5. Pitch', icon: Send },
  { id: 'delivery', stepNumber: 6, label: 'Partner Delivery', shortLabel: '6. Partner Hub', icon: BarChart3 },
];

export const WorkflowStepperBar: React.FC<WorkflowStepperBarProps> = ({
  currentStage,
  session,
  onNavigateStage,
  onResetWorkflow,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Effective step index in workflow sequence (0 to 5)
  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStage);
  const effectiveStepIndex = currentStepIndex >= 0 
    ? currentStepIndex 
    : (session.previousStage ? WORKFLOW_STEPS.findIndex((s) => s.id === session.previousStage) : 0);
  const currentStep = currentStepIndex >= 0 ? WORKFLOW_STEPS[currentStepIndex] : null;

  // Determine logical previous step for Back arrow
  const getPreviousStage = (): { stage: AppTab; label: string } | null => {
    if (currentStage === 'settings') {
      return { stage: session.previousStage || 'discover', label: 'Previous Screen' };
    }
    if (currentStepIndex > 0) {
      const prev = WORKFLOW_STEPS[currentStepIndex - 1];
      return { stage: prev.id, label: `Step ${prev.stepNumber}: ${prev.label}` };
    }
    return null;
  };

  const previousInfo = getPreviousStage();

  // Completed status detection:
  // A stage is ONLY 'Completed' if the user has moved on to a subsequent stage (idx < effectiveStepIndex).
  // If the user returns to a preceding stage, any stage ahead of the current stage resets to 'Draft'
  // until the user actually advances past it again.
  const isStepCompleted = (_stepId: AppTab, idx: number): boolean => {
    // If the user is currently on this stage, it is 'Current Step', NOT 'Completed'
    if (currentStage === _stepId) {
      return false;
    }

    // A stage only says 'Completed' if the user has progressed beyond it to a subsequent stage
    if (idx < effectiveStepIndex) {
      return true;
    }

    // Special case: if user reached delivery (step 6, idx 5) and navigated into settings
    if (currentStage === 'settings' && session.previousStage === 'delivery' && idx === 5) {
      return session.deliveryData.salesEvents.length > 0;
    }

    // Otherwise, stages ahead of or equal to current position are not completed (Draft)
    return false;
  };

  // Active instance summary labels
  const activeProblemLabel = session.selectedDemandSignal?.viralProblem || 
    session.productStudioData.viralProblem || 
    null;
  const activeCreatorLabel = session.selectedCreator?.handle || 
    (session.productStudioData.creatorHandle ? session.productStudioData.creatorHandle : null);
  const activeProductLabel = session.productStudioData.blueprint?.productTitle || null;

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    onResetWorkflow();
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Top Action Bar: Back Arrow, Instance Status & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 sm:px-5 shadow-sm">
        {/* Left: Back Button & Step Context */}
        <div className="flex items-center gap-3">
          {previousInfo ? (
            <button
              onClick={() => onNavigateStage(previousInfo.stage)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer shadow-sm group"
              title={`Return to ${previousInfo.label}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to {previousInfo.label}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step 1 of 6: Starting Point</span>
            </div>
          )}

          {/* Current Step Name Display */}
          {currentStep && (
            <div className="hidden md:flex items-center gap-2 text-xs border-l border-slate-800 pl-3">
              <span className="text-slate-400">Current:</span>
              <span className="font-bold text-white">
                Stage {currentStep.stepNumber}: {currentStep.label}
              </span>
            </div>
          )}
        </div>

        {/* Center/Right: Session Auto-Save Indicator & Reset Button */}
        <div className="flex items-center gap-2.5">
          {/* Active Auto-save Status Pill */}
          <div 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
            title="All changes, forms, and synthesized content are saved in your session across page refreshes"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Session:</span>
            <span className="text-emerald-400 font-semibold">Saved &amp; Protected</span>
          </div>

          {/* Start New Workflow Instance Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800/60 border border-slate-700/80 text-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Start a fresh workflow on a new niche or creator problem"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Start New Workflow</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Active Workflow Working Instance Context Banner (if any item selected) */}
      {(activeProblemLabel || activeCreatorLabel || activeProductLabel) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-[11px]">
          <div className="flex items-center gap-2 flex-wrap text-slate-300">
            <span className="font-semibold text-indigo-300">Active Workflow:</span>
            {activeProblemLabel && (
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-white font-medium truncate max-w-xs">
                🎯 {activeProblemLabel}
              </span>
            )}
            {activeCreatorLabel && (
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-teal-300 font-mono font-medium">
                👤 {activeCreatorLabel}
              </span>
            )}
            {activeProductLabel && (
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-indigo-200 font-medium truncate max-w-xs">
                📦 {activeProductLabel}
              </span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 italic">
            Working instance preserved across steps &amp; browser reloads
          </span>
        </div>
      )}

      {/* Stepper Progress Bar (Horizontal 6-Stage Timeline) */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-2 sm:p-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max sm:min-w-0 justify-between gap-1 sm:gap-2">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStage === step.id;
            const isCompleted = isStepCompleted(step.id, idx);
            const isPast = effectiveStepIndex > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onNavigateStage(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                      : isCompleted
                      ? 'bg-slate-950/70 text-slate-200 hover:text-white border border-emerald-900/50 hover:border-emerald-700/60'
                      : 'bg-slate-950/40 text-slate-400 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted && !isActive ? (
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="leading-none text-[11px] sm:text-xs">
                      {step.label}
                    </span>
                    <span className={`text-[9px] mt-0.5 ${
                      isActive ? 'text-indigo-200' : isCompleted ? 'text-emerald-400 font-medium' : 'text-slate-500'
                    }`}>
                      {isActive ? 'Current Step' : isCompleted ? 'Completed' : 'Draft'}
                    </span>
                  </div>
                </button>

                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className={`hidden lg:block h-0.5 w-4 rounded-full transition-colors ${
                    isPast ? 'bg-indigo-500/50' : 'bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Start New Workflow?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Start fresh on a new niche or creator</p>
                </div>
              </div>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              This will clear the current working instance data (selected problem, creator match, AI-generated curriculum, and pricing) and take you back to <strong>Step 1: Demand Discovery</strong> with a fresh workspace.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel &amp; Keep Draft
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Start New Workflow</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
