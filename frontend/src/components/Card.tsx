import { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export default function Card({ className = '', children }: CardProps) {
  return <div className={`frosted-card p-6 ${className}`}>{children}</div>;
}
