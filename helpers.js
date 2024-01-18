const API_BASE = 'https://bytebard.co/api';

export async function makeRequest(url, options = {}) {
    if (!options.headers) options.headers = {};
    if (!options.headers['x-spi-key']) throw new Error('Missing API key');
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    const response = await fetch(API_BASE + url, options);
    const json = await response.json();
    return json;
}
