import { cx } from 'class-variance-authority';
import { Icon } from '@iconify/react';
import type { HTMLAttributes } from 'react';

interface TestimonialCardProps extends HTMLAttributes<HTMLElement> {
  imageSrc: string;
  name: string;
  text: string;
  evidenceImage?: string;
}

export function TestimonialCard({
  imageSrc,
  name,
  text,
  evidenceImage,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <figure
      className={cx(
        'flex flex-col gap-4 border-secondary p-6 lg:gap-6 lg:rounded-md lg:border lg:p-8 lg:shadow-of-bg-surface',
        className
      )}
      {...props}
    >
      <figcaption className="flex items-center gap-4 lg:gap-6">
        <img
          src={imageSrc}
          alt={name}
          width={64}
          height={64}
          className="h-12 w-12 rounded-full object-cover shadow-of-bg-surface lg:h-16 lg:w-16"
        />
        <div className="space-y-0.5 lg:space-y-1">
          <cite className="font-primary text-heading-xl font-bold not-italic text-brand">
            {name}
          </cite>
          <div className="text-fill flex gap-1 text-sm lg:text-md">
            {[...Array(5)].map((_, i) => (
              <Icon key={i} icon="heroicons:star-solid" />
            ))}
          </div>
        </div>
      </figcaption>
      <blockquote className="font-secondary text-body-md text-secondary">
        {text}
      </blockquote>
      {evidenceImage && (
        <div className="mt-2 overflow-hidden rounded-md">
          <img
            src={evidenceImage}
            alt={`Evidence from ${name}`}
            className="w-full h-auto object-cover max-h-64"
          />
        </div>
      )}
    </figure>
  );
}

export default TestimonialCard;
