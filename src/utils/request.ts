'use server';

import { RestfulResponse } from '@/types/types';
import { generateHeadersForRequest } from '@/utils/request-headers';
import { parseUrl } from '@/utils/request-url';

export async function sendRequest(
  url: string,
  search: string
): Promise<RestfulResponse> {
  try {
    const { method, requestBody, apiUrl } = parseUrl(url);
    if (!method || !apiUrl)
      return {
        data: 'Invalid request data: method and/or api url are undefined',
        code: 500,
      };
    const searchParams = new URLSearchParams(search);
    const headers = generateHeadersForRequest(searchParams);
    const options = ['GET', 'HEAD'].includes(method)
      ? { headers, method }
      : { headers, method, body: requestBody };
    const request = new Request(apiUrl, options);
    const response = await fetch(request);
    if (!response.ok) {
      return { data: response.statusText, code: response.status };
    }
    if (['OPTIONS', 'HEAD'].includes(method)) {
      return {
        data: JSON.stringify(generateHeaders(response.headers)),
        code: response.status,
      };
    }
    const data = await response.json();
    return { data: JSON.stringify(data, null, 2), code: response.status };
  } catch (error) {
    if (error instanceof Error) return { data: error.message, code: 500 };
    else return { data: 'Unknown error', code: 520 };
  }
}

function generateHeaders(headers: Headers) {
  return [...headers].reduce(
    (obj, [key, value]) => {
      obj[key] = value;
      return obj;
    },
    {} as Record<string, string>
  );
}
