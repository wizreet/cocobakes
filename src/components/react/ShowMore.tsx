import { useState } from 'react';
import { cx } from 'class-variance-authority';
import { Icon } from '@iconify/react';
import Button from './Button';

interface ShowMoreProps {
  children: React.ReactNode;
  className?: string;
}

export function ShowMore({ children, className }: ShowMoreProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      className={cx(
        'group relative -mx-6 flex flex-col sm:mx-0 lg:flex-row lg:gap-8',
        className
      )}
      data-show-more={showMore}
    >
      {children}
      
      {!showMore && (
        <div
          className={cx(
            'absolute -bottom-4 left-0 right-0 flex h-64 flex-col sm:-left-6 sm:-right-6 lg:-left-8 lg:-right-8 lg:h-80'
          )}
        >
          <div className="flex-1 bg-gradient-to-t from-bg" />
          <div className="bg px-6 py-4 lg:px-0">
            <Button
              variant="secondary"
              className="mx-auto w-full lg:w-fit"
              onClick={() => setShowMore(true)}
            >
              <span>Show more</span>
              <Icon icon="heroicons:plus-20-solid" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowMore;
