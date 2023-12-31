import consola from 'consola';
import { headers } from 'next/headers';

const serviceRouteHandler = async (path: string, query: string | void) => {
  // Guard clause against running client side.
  // if (typeof window === 'undefined' || !path) {
  if (!path || path.length < 1) {
    consola.error(
      new Error(
        'The serviceRouteHandler function requires a path argument to be passed in.',
      ),
    );
    return null;
  }
  const serviceDomain = process.env.NEXT_PUBLIC_BASE_URL;

  const queryParameters = query ? `?${query}` : '';
  const requestUrl = `${serviceDomain}/${path}${queryParameters}`;
  // consoleLogger('The requestUrl:', requestUrl);
  // Request headers for communicating with the orchestrator.

  // Make the request to the orchestrator
  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers(),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      consola.error(new Error(`Server Error! status: ${response.status}`));
      return null;
    }

    if (response?.status && response?.status === 204) {
      consola.error(new Error('No content found'));
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    consola.error('Error fetching data: ', error);
    throw error;
  }
};

export default serviceRouteHandler;
