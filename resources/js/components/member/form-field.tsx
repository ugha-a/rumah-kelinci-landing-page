import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: ReactNode;
    error?: string;
};

export const fieldInputClasses =
    'h-11 w-full min-w-0 rounded-none border-0 border-b-2 border-line/70 bg-transparent px-0 text-base font-medium text-line transition-colors outline-none placeholder:text-line-soft/60 focus:border-ball focus-visible:outline-none aria-invalid:border-fault';

export const fieldLabelClasses =
    'mb-1 block text-[0.7rem] font-semibold tracking-[0.12em] text-line-soft uppercase';

/** Underline field from the booking composer, with label, hint and error. */
export function FormField({
    label,
    hint,
    error,
    className,
    id,
    ...props
}: FormFieldProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const describedBy = error
        ? `${fieldId}-error`
        : hint
          ? `${fieldId}-hint`
          : undefined;

    return (
        <div className={className}>
            <label htmlFor={fieldId} className={fieldLabelClasses}>
                {label}
            </label>
            <input
                id={fieldId}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={fieldInputClasses}
                {...props}
            />
            {error ? (
                <p
                    id={`${fieldId}-error`}
                    className="mt-1.5 text-sm text-fault"
                >
                    {error}
                </p>
            ) : (
                hint && (
                    <p
                        id={`${fieldId}-hint`}
                        className={cn('mt-1.5 text-sm text-line-soft')}
                    >
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}
