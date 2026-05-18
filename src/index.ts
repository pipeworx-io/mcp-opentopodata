interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Open Topo Data MCP.
 */


const BASE = 'https://api.opentopodata.org/v1';
const UA = 'pipeworx-mcp-opentopodata/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'elevation',
    description: 'Elevation at points. Up to 100 locations per request.',
    inputSchema: {
      type: 'object',
      properties: {
        locations: {
          type: 'array',
          items: { type: 'object' },
          description: 'Array of {lat, lon} (up to 100). Single object also accepted.',
        },
        dataset: { type: 'string', description: 'Default "srtm90m".' },
        samples: { type: 'number', description: 'Optional: interpolate N samples between first and last point.' },
        format: { type: 'string', description: 'json (default) | geojson' },
      },
      required: ['locations'],
    },
  },
  {
    name: 'datasets',
    description: 'List available DEM datasets.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'elevation': {
      let locs = args.locations as { lat: number; lon: number } | { lat: number; lon: number }[];
      if (!Array.isArray(locs)) locs = [locs];
      if (locs.length === 0) throw new Error('locations must be a non-empty array (or single object).');
      const locString = locs.slice(0, 100).map((p) => `${p.lat},${p.lon}`).join('|');
      const dataset = String(args.dataset ?? 'srtm90m');
      const p = new URLSearchParams({ locations: locString });
      if (args.samples) p.set('samples', String(args.samples));
      if (args.format) p.set('format', String(args.format));
      return topoGet(`/${dataset}?${p}`);
    }
    case 'datasets':
      return topoGet('/datasets.json');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function topoGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 429) throw new Error('Open Topo Data: 429 rate-limit (1 req/s, 1000/day public).');
  if (!res.ok) throw new Error(`Open Topo Data: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
