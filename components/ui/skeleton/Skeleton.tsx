import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(borderRadius !== undefined
      ? { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius }
      : {}),
  };

  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
}
