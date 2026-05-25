import { HttpResponse } from '@angular/common/http';

export function parseTextResponse(resp: HttpResponse<string>) {
  const contentType = resp.headers?.get?.('content-type') || '';
  const bodyText = resp.body ?? '';

  const looksLikeJson = contentType.includes('application/json') || /^\s*(\{|\[)/.test(bodyText);

  if (looksLikeJson) {
    try {
      return JSON.parse(bodyText);
    } catch (err) {
      throw {
        status: resp.status,
        statusText: resp.statusText,
        url: (resp as any).url,
        message: 'Respuesta JSON inválida',
        raw: bodyText
      };
    }
  }

  throw {
    status: resp.status,
    statusText: resp.statusText,
    url: (resp as any).url,
    message: 'Respuesta inesperada (no JSON)',
    contentType,
    raw: bodyText
  };
}

export function extractData(resp: HttpResponse<string>) {
  const parsed = parseTextResponse(resp);
  if (parsed && typeof parsed === 'object' && ('data' in parsed)) {
    return parsed.data;
  }
  return parsed;
}

export function isEmptyData(data: any) {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
}
