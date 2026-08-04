# @pipeworx/opentopodata

[Open Topo Data](https://www.opentopodata.org) MCP — global elevation lookups. Public instance keyless; 1 req/s + 1000 req/day soft limits.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `elevation(locations, dataset?, samples?, format?)` — elevation at points (max 100 per request)
- `datasets()` — list available DEM datasets

`locations` is an array of `{lat, lon}` objects, or a single object.
`dataset` examples: `aster30m` | `srtm30m` | `srtm90m` | `mapzen` | `nzdem8m` | `eudem25m` | `etopo1` | `gebco2020`. Default `srtm90m`.

## Data source

`https://api.opentopodata.org/v1/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "opentopodata": {
      "url": "https://gateway.pipeworx.io/opentopodata/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Opentopodata data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
