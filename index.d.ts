interface Endpoint {
  url: string;
  type: 'webmention' | 'pingback';
}

interface WebMention {
  source: string;
  endpoint: Endpoint;
}

interface ProgressCallback {
  (event: string, { type: string, value: number, data: any }): void;
}

interface EndpointCallback {
  (error: Error | null, endpoint: Endpoint?);
}

// type ProgressCallback = { type: string; value: number; data: any };
