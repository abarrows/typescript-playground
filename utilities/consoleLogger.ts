// TODO: Fix the eslint import plugin for tsx.

import consola from 'consola';

type LogType =
  | 'advertising'
  | 'analytics'
  | 'auth'
  | 'default'
  | 'integration'
  | 'seo';

type LogStyle = {
  backgroundColor: string;
  color: string;
  header: string;
};

export const types: Record<LogType, LogStyle> = {
  advertising: {
    backgroundColor: '#00c389',
    color: '#fffcf2',
    header: 'Advertising',
  },
  analytics: {
    backgroundColor: '#e6710a',
    color: 'white',
    header: 'SEO',
  },
  auth: {
    backgroundColor: '#EDF7EF',
    color: '#64B969',
    header: 'Auth',
  },
  default: {
    backgroundColor: '#421a82',
    color: '#ffffff',
    header: 'Debug',
  },
  integration: {
    backgroundColor: '#d95449',
    color: '#2ead33',
    header: 'CI:Tests:Integration',
  },
  seo: {
    backgroundColor: '#421a82',
    color: 'white',
    header: 'SEO',
  },
};

export const applyStyles = ({
  backgroundColor,
  color,
}: {
  backgroundColor: string;
  color: string;
}): string => {
  const inlineStyles = [
    `color: ${color}`,
    `background-color: ${backgroundColor}`,
    'padding: 2px 4px',
    'border-radius: 2px',
  ];

  return `${inlineStyles.join(';')};`;
};

export const createHeader = (type: LogType = 'default'): [string, string] => {
  const { header, backgroundColor, color } = types[type];
  return [`%c GPT ${header}`, applyStyles({ backgroundColor, color })];
};

const sanitizedMessage = (message: string): string => {
  return JSON.stringify(message);
};

const MAX_PAYLOAD_SIZE = 50000; // Adjust this value based on your needs

/* istanbul ignore next */
// Excluding from coverage because it is not easy testing console logs

export const consoleLogger = (
  // Make type argument optional and default to 'default'
  // { type: LogType = 'default' },
  message: string,
  ...additionalArgs: unknown[]
): void => {
  // const customHeader = createHeader(type);

  // Safeguard against undefined message
  const safeMessage = message ?? '';
  const messageLength = JSON.stringify(safeMessage).length;
  if (messageLength > MAX_PAYLOAD_SIZE) {
    consola.warn(
      "This console log's message is reaching the maximum limit. Please consider passing a smaller message.",
    );
  }

  // Process additional arguments
  const processedArgs = additionalArgs.map((arg) => {
    const strArg = JSON.stringify(arg);
    if (strArg.length > MAX_PAYLOAD_SIZE) {
      consola.warn(
        "One of the console log's additional arguments is reaching the maximum limit. Please consider passing smaller arguments.",
      );
      return typeof arg === 'object' ? Object.keys(arg as object) : arg;
    }
    return arg;
  });

  if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'production') {
    consola.info(
      // ...customHeader,
      sanitizedMessage(safeMessage),
      ...processedArgs,
    );
  }
};

// Clone the consoleLogger to use as a warning logger for the same environment
// using the withScope('SEO') type.
export const seoLogger = (
  message: string,
  ...additionalArgs: unknown[]
): void => {
  const customHeader = createHeader('seo');

  // Safeguard against undefined message
  const safeMessage = message ?? '';
  const messageLength = JSON.stringify(safeMessage).length;
  if (messageLength > MAX_PAYLOAD_SIZE) {
    consola.warn(
      "This console log's message is reaching the maximum limit. Please consider passing a smaller message.",
    );
  }

  // Process additional arguments
  const processedArgs = additionalArgs.map((arg) => {
    const strArg = JSON.stringify(arg);
    if (strArg.length > MAX_PAYLOAD_SIZE) {
      consola.warn(
        "One of the console log's additional arguments is reaching the maximum limit. Please consider passing smaller arguments.",
      );
      return typeof arg === 'object' ? Object.keys(arg as object) : arg;
    }
    return arg;
  });

  if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'production') {
    consola
      .withTag('SEO')
      .error(...customHeader, sanitizedMessage(safeMessage), ...processedArgs);
  }
};

export default consoleLogger;
