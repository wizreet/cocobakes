import { cx } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

interface FeaturedDelightCardProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  description: string;
}

export function FeaturedDelightCard({
  imageSrc,
  title,
  description,
  className,
  ...props
}: FeaturedDelightCardProps) {
  return (
    <div
      className={cx(
        'space-y-5 lg:space-y-0 lg:bg-surface lg:shadow-of-bg-surface',
        className
      )}
      {...props}
    >
      <img
        src={imageSrc}
        alt={title}
        width={382}
        className="lg:shadow-none aspect-video w-full rounded-md object-cover shadow-of-bg-surface lg:aspect-4/3 lg:rounded-b-none"
      />
      <div className="space-y-3 lg:rounded-b-md lg:border-x lg:border-b lg:border-secondary lg:p-8">
        <h3 className="font-primary text-heading-xl font-bold text-brand">
          {title}
        </h3>
        <p className="font-secondary text-body-md font-regular text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FeaturedDelightCard;
