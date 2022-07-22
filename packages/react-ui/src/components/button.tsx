import React from 'react';
import styles from './button.less';

export const IconButton: React.FC<
  React.ButtonHTMLAttributes<HTMLAnchorElement>
> = props => {
  const { children, ...attr } = props;
  return (
    <a className={styles.IconButton} {...attr}>
      {props.children}
    </a>
  );
};
