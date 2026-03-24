import { ESCROW_STEPS } from '@smartinvoicexyz/constants';
import { hashCode } from '@smartinvoicexyz/utils';

import { BackArrowIcon } from '../icons/ArrowIcons';

const TOTAL_STEPS = 5;

function StepCircle({
  step,
  label,
  isCompleted,
  isCurrent,
}: {
  step: number;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  let bgClass = 'bg-gray-200';
  let textClass = 'text-gray-500';
  let borderClass = 'border-gray-200';

  if (isCompleted) {
    bgClass = 'bg-blue-400';
    textClass = 'text-white';
    borderClass = 'border-blue-400';
  } else if (isCurrent) {
    bgClass = 'bg-white';
    textClass = 'text-blue-400';
    borderClass = 'border-blue-400';
  }

  const labelColorClass = isCurrent
    ? 'text-blue-500 font-semibold'
    : isCompleted
      ? 'text-blue-400'
      : 'text-gray-400';

  return (
    <div className="flex flex-col items-center min-w-0">
      <div
        className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full ${bgClass} ${textClass} border-2 ${borderClass} font-bold text-xs md:text-sm shrink-0`}
      >
        {isCompleted ? '\u2713' : step}
      </div>
      <p
        className={`hidden md:block text-xs ${labelColorClass} mt-1 text-center leading-tight max-w-[80px]`}
      >
        {label}
      </p>
    </div>
  );
}

function ConnectorLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div
      className={`flex-1 h-0.5 ${isCompleted ? 'bg-blue-400' : 'bg-gray-200'} self-start mt-[13px] md:mt-[17px] mx-1`}
    />
  );
}

export function StepInfo({
  stepNum,
  stepsDetails,
  goBack,
}: {
  stepNum: number;
  stepsDetails: typeof ESCROW_STEPS;
  goBack: (() => void) | undefined;
}) {
  const stepTitle = stepsDetails[stepNum].step_title;
  const stepDetails = stepsDetails[stepNum].step_details;

  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => ({
    num: i + 1,
    label: stepsDetails[i + 1]?.step_title ?? `Step ${i + 1}`,
  }));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Progress bar */}
      <div className="flex items-start w-full px-0 md:px-4 pt-2">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className={`flex items-start ${i < TOTAL_STEPS - 1 ? 'flex-1' : ''}`}
          >
            <StepCircle
              step={s.num}
              label={s.label}
              isCompleted={s.num < stepNum}
              isCurrent={s.num === stepNum}
            />
            {i < TOTAL_STEPS - 1 && (
              <ConnectorLine isCompleted={s.num < stepNum} />
            )}
          </div>
        ))}
      </div>

      {/* Header with back button and title */}
      <div className="flex justify-between items-center my-2">
        {stepNum !== 1 && stepNum !== 5 && !!goBack ? (
          <button
            onClick={() => goBack()}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            aria-label="back"
          >
            <BackArrowIcon
              style={{ width: '2rem', height: '1.5rem', color: 'white' }}
            />
          </button>
        ) : (
          <div className="max-w-[50px]" />
        )}

        <h2 className="text-[#323C47] text-base sm:text-lg md:text-xl font-heading">
          Step {stepNum}: {stepTitle}
        </h2>

        <div className="max-w-[50px]" />
      </div>

      {/* Step details */}
      {stepDetails.map((detail: string) => (
        <p className="text-gray-500 text-sm" key={hashCode(detail)}>
          {detail}
        </p>
      ))}
    </div>
  );
}
