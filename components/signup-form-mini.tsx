import { EmailIcon } from './email-icon';
import { reportEvent } from '../services/analytics';

const options = {
  settings: {
    after_subscribe: {
      action: 'message',
      success_message: 'Success! Now check your email to confirm your subscription.',
      redirect_url: '',
    },
    analytics: { google: null, facebook: null, segment: null, pinterest: null },
    modal: {
      trigger: 'timer',
      scroll_percentage: null,
      timer: 5,
      devices: 'all',
      show_once_every: 15,
    },
    powered_by: {
      show: false,
      url:
        'https://convertkit.com?utm_source=dynamic&amp;utm_medium=referral&amp;utm_campaign=poweredby&amp;utm_content=form',
    },
    recaptcha: { enabled: false },
    return_visitor: { action: 'show', custom_content: '' },
    slide_in: {
      display_in: 'bottom_right',
      trigger: 'timer',
      scroll_percentage: null,
      timer: 5,
      devices: 'all',
      show_once_every: 15,
    },
    sticky_bar: {
      display_in: 'top',
      trigger: 'timer',
      scroll_percentage: null,
      timer: 5,
      devices: 'all',
      show_once_every: 15,
    },
  },
  version: '5',
};

export function SignupFormMini() {
  return (
    <>
      <script src="https://f.convertkit.com/ckjs/ck.5.js"></script>
      <form
        action="https://app.convertkit.com/forms/1479267/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="1479267"
        data-uid="82feb49181"
        data-format="inline"
        data-version="5"
        data-options={JSON.stringify(options)}
        onSubmit={() => reportEvent({ action: 'subscribe', category: 'form', label: 'header' })}
      >
        <div data-style="clean">
          <ul
            className="formkit-alert formkit-alert-error"
            data-element="errors"
            data-group="alert"
          ></ul>
          <div data-element="fields" data-stacked="false" className="seva-fields formkit-fields">
            <div className="formkit-field">
              <EmailIcon />
              <input
                className="formkit-input"
                name="email_address"
                placeholder="Get new Arduino examples every week"
                required
                type="email"
              />
            </div>
            <button data-element="submit" className="formkit-submit formkit-submit">
              <div className="formkit-spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>Stay Updated</span>
            </button>
          </div>
        </div>
      </form>
      <style jsx>{`
        .formkit-form * {
          box-sizing: border-box;
        }

        .formkit-form {
          width: 100%;
          max-width: calc(100vw - 20px);
        }

        .formkit-form p {
          color: inherit;
          font-size: inherit;
          font-weight: inherit;
        }
        .formkit-form ol:not([template-default]),
        .formkit-form ul:not([template-default]),
        .formkit-form blockquote:not([template-default]) {
          text-align: left;
        }
        .formkit-form p:not([template-default]),
        .formkit-form hr:not([template-default]),
        .formkit-form blockquote:not([template-default]),
        .formkit-form ol:not([template-default]),
        .formkit-form ul:not([template-default]) {
          color: inherit;
          font-style: initial;
        }
        .formkit-form .formkit-input,
        .formkit-form .formkit-select,
        .formkit-form .formkit-checkboxes {
          width: 100%;
        }
        .formkit-form .formkit-button,
        .formkit-form .formkit-submit {
          border: 0;
          border-radius: 5px;
          color: #ffffff;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 15px;
          overflow: hidden;
          padding: 0;
          position: relative;
          vertical-align: middle;
        }
        .formkit-form .formkit-button:hover,
        .formkit-form .formkit-submit:hover,
        .formkit-form .formkit-button:focus,
        .formkit-form .formkit-submit:focus {
          outline: none;
        }
        .formkit-form .formkit-button:hover > span,
        .formkit-form .formkit-submit:hover > span,
        .formkit-form .formkit-button:focus > span,
        .formkit-form .formkit-submit:focus > span {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .formkit-form .formkit-button > span,
        .formkit-form .formkit-submit > span {
          display: block;
          -webkit-transition: all 300ms ease-in-out;
          transition: all 300ms ease-in-out;
          padding: 12px 24px;
        }
        .formkit-form .formkit-input {
          background: #ffffff;
          font-size: 15px;
          border: none;
          flex: 1;
          line-height: 1.4;
          margin: 0 0 0 8px;
          -webkit-transition: border-color ease-out 300ms;
          transition: border-color ease-out 300ms;
        }
        .formkit-form .formkit-input:focus {
          outline: none;
          border-color: #1677be;
          -webkit-transition: border-color ease 300ms;
          transition: border-color ease 300ms;
        }
        .formkit-form .formkit-input::placeholder {
          color: inherit;
          opacity: 0.8;
        }
        .formkit-form .formkit-alert {
          background: #f9fafb;
          border: 1px solid #e3e3e3;
          border-radius: 5px;
          -webkit-flex: 1 0 auto;
          -ms-flex: 1 0 auto;
          flex: 1 0 auto;
          list-style: none;
          margin: 25px auto;
          padding: 12px;
          text-align: center;
          width: 100%;
        }
        .formkit-form .formkit-alert:empty {
          display: none;
        }
        .formkit-form .formkit-alert-success {
          background: #d3fbeb;
          border-color: #10bf7a;
          color: #0c905c;
        }
        .formkit-form .formkit-alert-error {
          background: #fde8e2;
          border-color: #f2643b;
          color: #ea4110;
        }
        .formkit-form .formkit-spinner {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          height: 0px;
          width: 0px;
          margin: 0 auto;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 0px;
          overflow: hidden;
          text-align: center;
          -webkit-transition: all 300ms ease-in-out;
          transition: all 300ms ease-in-out;
        }
        .formkit-form .formkit-spinner > div {
          margin: auto;
          width: 12px;
          height: 12px;
          background-color: #fff;
          opacity: 0.3;
          border-radius: 100%;
          display: inline-block;
          -webkit-animation: formkit-bouncedelay-formkit-form-data-uid-82feb49181- 1.4s infinite
            ease-in-out both;
          animation: formkit-bouncedelay-formkit-form-data-uid-82feb49181- 1.4s infinite ease-in-out
            both;
        }
        .formkit-form .formkit-spinner > div:nth-child(1) {
          -webkit-animation-delay: -0.32s;
          animation-delay: -0.32s;
        }
        .formkit-form .formkit-spinner > div:nth-child(2) {
          -webkit-animation-delay: -0.16s;
          animation-delay: -0.16s;
        }
        .formkit-form .formkit-submit[data-active] .formkit-spinner {
          opacity: 1;
          height: 100%;
          width: 50px;
        }
        .formkit-form .formkit-submit[data-active] .formkit-spinner ~ span {
          opacity: 0;
        }
        @-webkit-keyframes formkit-bouncedelay-formkit-form-data-uid-82feb49181- {
          0%,
          80%,
          100% {
            -webkit-transform: scale(0);
            -ms-transform: scale(0);
            transform: scale(0);
          }
          40% {
            -webkit-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
          }
        }
        @keyframes formkit-bouncedelay-formkit-form-data-uid-82feb49181- {
          0%,
          80%,
          100% {
            -webkit-transform: scale(0);
            -ms-transform: scale(0);
            transform: scale(0);
          }
          40% {
            -webkit-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
          }
        }
        .formkit-form blockquote {
          padding: 10px 20px;
          margin: 0 0 20px;
          border-left: 5px solid #e1e1e1;
        }
        .formkit-form [data-style='clean'] {
          width: 100%;
        }
        .formkit-form .formkit-fields {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-flex-wrap: wrap;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin: 0 auto;
        }
        .formkit-field {
          padding: 12px;
          flex: 1;
          border: 1px solid #e3e3e3;
          display: flex;
        }
        .formkit-form .formkit-field,
        .formkit-form .formkit-submit {
          margin: 0 5px 15px 5px;
        }
        .formkit-submit {
          color: rgb(255, 255, 255);
          background-color: rgb(22, 119, 190);
          border-radius: 4px;
          font-weight: 400;
        }
      `}</style>
    </>
  );
}
