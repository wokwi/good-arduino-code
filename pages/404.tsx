import { Header } from '../components/header';
import React from 'react';

export default function Custom404() {
  return (
    <div>
      <Header />
      <div className="custom-404">
        <div className="text">
          <div className="err-code"> 404 </div>
          <div> Oops! you reached a broken link :( </div>
          <a href="/" className="home">
            Back to home page
          </a>
        </div>
        <img className="magnifying-glass" src="images/arduino-uno.svg" alt="arduino uno" />
        <style jsx>{`
          .custom-404 {
            display: grid;
            place-content: center;
            height: 85vh;
            background: #02111c;
          }
          .magnifying-glass {
            width: 60%;
            filter: grayscale(1);
            transform: translateX(40%);
            opacity: 0.9;
          }
          .text {
            text-align: center;
            font-family: monospace;
            transform: translateY(-50px);
            font-size: 19px;
            line-height: 1.6;
            color: whitesmoke;
          }
          .home {
            color: whitesmoke;
          }
          .err-code {
            font-size: 40px;
          }
          @media (max-width: 690px) {
            .custom-404 {
              width: 104vw;
            }
            .text {
              font-size: 14px;
            }
            .magnifying-glass {
              width: 50%;
              transform: translateX(60%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
