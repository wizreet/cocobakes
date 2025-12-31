import { useState, useRef, useEffect } from 'react';
import { cx } from 'class-variance-authority';
import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
}

export function TextArea({
  id,
  label,
  required = true,
  className,
  ...props
}: TextAreaProps) {
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const baseHeight = 56; // h-14 = 3.5rem = 56px
    const lineHeight = 24; // approximate line height

    textarea.style.height = '0';
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = 'auto';

    const textHeight = scrollHeight - baseHeight + lineHeight;
    const numberOfLines = Math.max(1, Math.ceil(textHeight / lineHeight));
    setRows(numberOfLines);
  };

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="font-primary text-heading-xl font-bold text-brand">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        required={required}
        rows={rows}
        onInput={handleInput}
        className="focus-visible:border-brand-hover ring-brand-hover resize-none overflow-y-hidden rounded-md border border-primary bg-surface px-3 py-[0.8875rem] font-secondary text-body-md font-regular text placeholder:text-secondary/50 focus-visible:outline-none focus-visible:ring-1"
        {...props}
      />
    </div>
  );
}

export default TextArea;
