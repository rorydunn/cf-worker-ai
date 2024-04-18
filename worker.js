import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    } else if (request.method !== "POST") {
      // Only allow POST requests for the actual chat interaction
      return new Response("Method not allowed", { status: 405 });
    }

    const { message } = await request.json();

    const ai = new Ai(env.AI);
    
    let simple = { prompt: message }; // Use the message directly without replacing hyphens
    let response = await ai.run('@hf/thebloke/deepseek-coder-6.7b-instruct-awq', simple);
    const tasks = [{ inputs: simple, response }];

    // Ensure the response includes CORS headers
    return new Response(JSON.stringify(tasks), {
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers
        'Access-Control-Allow-Origin': '*', // Adjust accordingly for production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
};

// Handle OPTIONS request
function handleOptions(request) {
  // Make sure the necessary headers are present 
  // for this to be a valid pre-flight request
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or set any headers, you can do that here.
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust accordingly for production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'POST, OPTIONS',
      },
    });
  }
}
