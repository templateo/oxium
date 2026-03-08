// netlify/functions/proxy.js
// Proxies requests to mail.tm server-side so CORS is never an issue.
// Deployed automatically by Netlify — no config needed beyond netlify.toml

const MAILTM = 'https://api.mail.tm';

exports.handler = async function(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if(event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  // Strip /.netlify/functions/proxy from path, keep the rest
  const path = event.path.replace('/.netlify/functions/proxy', '') || '/';
  const url = MAILTM + path + (event.rawQuery ? '?' + event.rawQuery : '');

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if(event.headers['authorization']) headers['Authorization'] = event.headers['authorization'];

  try {
    const res = await fetch(url, {
      method: event.httpMethod,
      headers,
      body: ['GET','HEAD'].includes(event.httpMethod) ? undefined : event.body,
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch(e) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
