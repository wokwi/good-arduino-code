export default function Custom404() {
  return (
    <div className="custom-404">
      <div className="text">
        <div className="err-code"> 404 </div>
        <div> Oops! you reached a broken link :( </div>
        <a href="/" className="home">
          Back to home page
        </a>
      </div>
      <img className="grayed" src="images/arduino-uno.svg"></img>
      <style jsx>{`
        .custom-404 {
          display: grid;
          place-content: center;
          height: 98vh;
          background: #02111c;
        }
        .grayed {
          width: 70%;
          filter: grayscale(1);
          transform: translateX(30%);
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
      `}</style>
    </div>
  );
}
