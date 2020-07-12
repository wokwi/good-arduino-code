import Link from 'next/link';
import { SignupFormMini } from './signup-form-mini';
import { SignupFormMobile } from './signup-form-mobile';

export function Header() {
  return (
    <>
      <header>
        <div className="content">
          <Link href="/">
            <a>
              <img src="/gac-logo.svg" height="80" alt="Good Arduino Code" />
            </a>
          </Link>
          <div className="signup">
            <SignupFormMini />
          </div>
        </div>
      </header>
      <div className="signup-mobile">
        <SignupFormMobile />
      </div>
      <style jsx>{`
        header {
          border-bottom: 1px solid #e1e1e1;
          height: 80px;
        }

        .content {
          display: flex;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
        }

        a {
          text-decoration: none;
          font-size: 24px;
          padding: 0 24px;
        }

        .signup {
          display: flex;
          width: 600px;
          flex: 1;
        }

        .signup-mobile {
          display: none;
        }

        @media (max-width: 700px) {
          .signup {
            display: none;
          }

          .signup-mobile {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
