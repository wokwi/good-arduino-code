import Link from 'next/link';
import { SignupForm } from './signup-form';

export function Header() {
  return (
    <header>
      <Link href="/">
        <a>
          <img src="/gac-logo.svg" height="80" alt="Good Arduino Code" />
        </a>
      </Link>

      <style jsx>{`
        a {
          display: block;
          text-decoration: none;
          vertical-align: middle;
          font-size: 24px;
          padding: 0 24px;
        }

        header {
          color: purple;
          border-bottom: 1px solid #e1e1e1;
          height: 80px;
          line-height: 48px;
        }
      `}</style>
    </header>
  );
}
