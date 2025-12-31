import { Icon as IconifyIcon } from '@iconify/react';
import { cx } from 'class-variance-authority';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  // Convert astro-icon format to iconify format
  // e.g., "heroicons:arrow-long-right-20-solid" stays the same
  return <IconifyIcon icon={name} className={cx('inline-block', className)} />;
}

export default Icon;
