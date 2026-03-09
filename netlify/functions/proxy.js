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

  // event.path will be /.netlify/functions/proxy/domains?page=1
  // We want everything after /proxy
  const stripped = event.path.split('/proxy')[1] || '/';
  const url = MAILTM + stripped + (event.rawQuery ? '?' + event.rawQuery : '');

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
