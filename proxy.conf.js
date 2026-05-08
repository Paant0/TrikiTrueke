const HEADERS_TO_REMOVE = [
  'sec-ch-ua',
  'sec-ch-ua-arch',
  'sec-ch-ua-bitness',
  'sec-ch-ua-full-version',
  'sec-ch-ua-full-version-list',
  'sec-ch-ua-mobile',
  'sec-ch-ua-model',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-ua-wow64',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-user',
  'upgrade-insecure-requests',
  'accept-language',
  'accept-encoding',
  'dnt',
  'priority',
];

// Solo estas cookies son relevantes para Spring Boot
const ALLOWED_COOKIES = ['JSESSIONID', 'XSRF-TOKEN'];

function cleanRequest(proxyReq) {
  // 1. Eliminar headers pesados de Chrome
  HEADERS_TO_REMOVE.forEach(h => proxyReq.removeHeader(h));

  // 2. Filtrar cookies: solo pasar las de Spring Boot, ignorar Supabase, Google, etc.
  const rawCookie = proxyReq.getHeader('cookie');
  if (rawCookie) {
    const filtered = rawCookie
      .split(';')
      .map(c => c.trim())
      .filter(c => ALLOWED_COOKIES.some(name => c.startsWith(name + '=')))
      .join('; ');

    if (filtered) {
      proxyReq.setHeader('cookie', filtered);
    } else {
      proxyReq.removeHeader('cookie'); // Sin cookies relevantes → eliminar el header
    }
  }
}

const BACKEND = 'http://localhost:8080';
const PROXY_OPTS = {
  target: BACKEND,
  secure: false,
  changeOrigin: true,
  on: {
    proxyReq: cleanRequest,
    error: (err, req, res) => {
      console.error('[proxy] ❌ Backend no disponible:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Backend no disponible en ' + BACKEND }));
    }
  }
};

module.exports = {
  '/api':          PROXY_OPTS,
  '/usuarios':     PROXY_OPTS,
  '/categorias':   PROXY_OPTS,
  '/articulos':    PROXY_OPTS,
  '/intercambios': PROXY_OPTS,
};
