import { Header } from '../components/header';
import React from 'react';
import Head from 'next/head';

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>It's Four-oh-Four, Fella! GoodArduinoCode.com</title>
        <meta name="description" content="We couldn't find that page. We really tried hard!" />
        <meta property="og:title" content="It's Four-oh-Four, Fella! GoodArduinoCode.com" />
        <meta
          property="og:description"
          content="We couldn't find that page. We really tried hard!"
        />
        <meta property="og:image" content="https://goodarduinocode.com/images/social-cover.jpg" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WokwiMakes" />
      </Head>
      <Header />
      <div className="custom-404">
        <div className="text">
          <div className="err-code"> 404 </div>
          <div> Oops! you reached a broken link :( </div>
          <a href="/" className="home">
            Back to home page
          </a>
        </div>
        <SvgMagnifyingGlassComponent />
        <style jsx>{`
          .custom-404 {
            display: grid;
            place-content: center;
            height: 85vh;
            background: #02111c;
          }
          .text {
            text-align: center;
            font-family: monospace;
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
          }
        `}</style>
      </div>
    </div>
  );
}

function SvgMagnifyingGlassComponent(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg width={396} height={280} className="scale" {...props}>
      <g fill="none">
        <path
          d="M213.857 165.852a7.475 7.475 0 00-5.733-.237 7.477 7.477 0 00-4.225 3.886l-6.193 13.353a7.477 7.477 0 00-.244 5.72 7.477 7.477 0 003.864 4.227l177.06 83.004a7.476 7.476 0 005.734.238 7.477 7.477 0 004.224-3.887l6.194-13.352a7.477 7.477 0 00.244-5.721 7.477 7.477 0 00-3.864-4.226l-177.06-83.005z"
          stroke="#060606"
          fill="gray"
        />
        <ellipse stroke="#979797" fill="#D3D3D3" cx={140} cy={140} rx={134.5} ry={139.5} />
        <image x={29} y={64} width={210} height={153} href="images/uno.png" />
      </g>
      <style jsx>
        {`
          .scale {
            transform: scale(0.6);
          }
          @media (max-width: 690px) {
            .scale {
              transform: scale(0.5);
            }
          }
        `}
      </style>
    </svg>
  );
}
