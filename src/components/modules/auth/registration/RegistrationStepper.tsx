"use client";

import { RiCheckLine } from "react-icons/ri";

export interface StepMeta {
    id: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

interface RegistrationStepperProps {
    steps: StepMeta[];
    currentStep: number;
    furthestStep: number;
    onStepClick: (stepId: number) => void;
}

const RegistrationStepper = ({ steps, currentStep, furthestStep, onStepClick }: RegistrationStepperProps) => {
    const total = steps.length;
    const progressPercent = ((currentStep + 1) / total) * 100;

    return (
        <div className="mb-7">
            {/* Compact mobile version */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary2-900 dark:text-gunmetal-100">
                        Step {currentStep + 1} of {total}
                    </span>
                    <span className="text-xs font-medium text-gunmetal-300">
                        {steps[currentStep].title}
                    </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-primary2-50 dark:bg-gunmetal-700 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Full desktop stepper */}
            <div className="hidden sm:flex items-start">
                {steps.map((step, idx) => {
                    const isCompleted = step.id < currentStep || step.id < furthestStep;
                    const isCurrent = step.id === currentStep;
                    const isClickable = step.id <= furthestStep;
                    const isLast = idx === steps.length - 1;

                    return (
                        <div key={step.id} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick(step.id)}
                                    disabled={!isClickable}
                                    aria-current={isCurrent ? "step" : undefined}
                                    aria-label={`${step.title}${isCompleted ? " (completed)" : ""}`}
                                    className={[
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                                        isCurrent
                                            ? "border-primary bg-primary text-white shadow-sm scale-105"
                                            : isCompleted
                                                ? "border-primary bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                                                : "border-primary2-100 dark:border-gunmetal-600 text-primary2-200 dark:text-gunmetal-400 cursor-not-allowed",
                                    ].join(" ")}
                                >
                                    {isCompleted ? <RiCheckLine className="h-5 w-5" /> : step.icon}
                                </button>
                                <div className="mt-2 text-center max-w-[110px] hidden md:block">
                                    <p
                                        className={`text-xs font-semibold leading-tight ${isCurrent
                                            ? "text-primary2-900 dark:text-gunmetal-100"
                                            : "text-primary2-200 dark:text-gunmetal-400"
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>

                            {!isLast && (
                                <div
                                    className={`h-0.5 flex-1 mx-2 mt-5 rounded-full transition-colors duration-300 ${step.id < furthestStep ? "bg-primary" : "bg-primary2-50 dark:bg-gunmetal-700"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default RegistrationStepper;