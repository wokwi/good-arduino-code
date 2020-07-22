import { isProduction } from './environment';

declare function gtag(cmd: string, action: string, args: any): void;

const debug = !isProduction;

export interface IGAEventParams {
  action: string;
  category: string;
  label: string;
}

export function reportEvent({ action, category, label }: IGAEventParams, beacon = false) {
  if (debug) {
    const resetStyle = 'color: initial; font-weight: initial';
    console.log(
      '[analytics:%c%s%c] %c%s%c (%c%s%c)',
      'color: blue; font-weight: bold',
      category,
      resetStyle,
      'color: green; font-weight: bold',
      action,
      resetStyle,
      'color: purple; font-weight: bold',
      label,
      resetStyle,
    );
    return;
  }

  gtag('event', action, {
    event_category: category,
    event_label: label,
    ...(beacon ? { transport_type: 'beacon' } : {}),
  });
}
