const MAILTM = 'https://api.mail.tm';

exports.handler = async function(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  // Return debug info so we can see exactly what Netlify passes
  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({
      path: event.path,
      pathParameters: event.pathParameters,
      rawQuery: event.rawQuery,
      httpMethod: event.httpMethod,
    }, null, 2),
  };
};
