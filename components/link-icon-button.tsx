import Icon from '@mdi/react';

export interface LinkIconButtonProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  target?: string;
}

export function LinkIconButton({ href, target, icon, children }: LinkIconButtonProps) {
  return (
    <a href={href} className="icon-button" target={target} rel={target && 'noreferrer'}>
      <Icon path={icon} size={1} />
      <span>{children}</span>

      <style jsx>{`
        .icon-button {
          display: inline-flex;
          text-decoration: none;
          border: solid #ccc 1px;
          margin-left: 8px;
          padding: 4px;
          border-radius: 4px;
        }

        .icon-button:hover {
          background: #eee;
        }

        .icon-button > span {
          padding: 0 4px;
        }
      `}</style>
    </a>
  );
}
