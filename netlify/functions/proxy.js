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

  const stripped = event.path.split('/proxy')[1] || '/';
  const qs = event.rawQuery ? '?' + event.rawQuery : '';
  const url = MAILTM + stripped + qs;

  console.log('Proxying:', event.httpMethod, url);

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/ld+json, application/json',
  };
  if(event.headers['authorization']) {
    headers['Authorization'] = event.headers['authorization'];
  }

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
