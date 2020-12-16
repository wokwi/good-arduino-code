import { forwardRef } from 'react';

export interface ICardProps {
  title: string;
  description?: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  thumbnail?: React.ReactNode;
}

export const Card = forwardRef<HTMLAnchorElement, ICardProps>(
  ({ title, description, href, thumbnail, onClick }, ref) => {
    return (
      <a className="card" href={href} onClick={onClick} ref={ref}>
        {thumbnail}
        <h3>
          <span>{title}</span>
        </h3>
        <p>
          <span>{description}</span>
        </p>
        <style jsx>{`
          .card {
            position: relative;
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: 100% 50%;
            min-height: 200px;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card > :global(img) {
            position: absolute;
            top: 0;
            height: 200px;
            right: 0;
            z-index: -1;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card h3 > span,
          .card p > span {
            background-color: white;
            padding: 0 8px 0 0;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }
        `}</style>
      </a>
    );
  },
);
