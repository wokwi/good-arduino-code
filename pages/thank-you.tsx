import { GlobalStyles } from '../components/global-styles';

export default function ThankYouPage() {
  return (
    <div className="container">
      <GlobalStyles />
      <h1>Thank you for signing up!</h1>
      <p>You are awesome. We'll send some great content your way soon...</p>
      <img
        src="https://embed.filekitcdn.com/e/mZyG2hsryyXNi4NTxTeGDU/kyQc1N9Hu9KYJAMVEckP6/email"
        alt="Thank you"
      />
      <style jsx>{`
        .container {
          text-align: center;
        }

        p {
          margin-bottom: 32px;
        }

        img {
          max-width: 100vw;
        }
      `}</style>
    </div>
  );
}
