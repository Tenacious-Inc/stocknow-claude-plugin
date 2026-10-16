# StockNow for Claude

**English** · [한국어](README.ko.md) · [日本語](README.ja.md)

**Explore StockNow stock prices, earnings, news, and SEC filings in your conversations with Claude.**

A Claude plugin that connects to the StockNow MCP server. Sign in with your StockNow
account to compare company earnings, read filings and earnings call transcripts, and
follow news about the stocks on your watchlist within the same conversation.

[StockNow](https://stocknow.ai/en) · [MCP overview](https://stocknow.ai/en/mcp)

## Features

| Category | What you can access |
| --- | --- |
| Prices and indices | Current stock prices, historical price trends, and major index movements |
| Earnings | Reporting dates, EPS consensus estimates, and reported results |
| Earnings calls | Full transcript search and reading |
| SEC filings | Full text of 10-K, 10-Q, and 8-K filings |
| News | Market headlines and company news by date, ticker, or keyword |
| Financials and screeners | Financial statements, key ratios, dividends, short interest, and stock screening |
| Watchlists | Stocks saved to your StockNow account |

The plugin connects directly to StockNow's hosted MCP server over **Streamable HTTP**.

```text
https://mcp.stocknow.ai/mcp
```

See the [StockNow MCP overview](https://stocknow.ai/en/mcp) for supported capabilities.
Available tools and response formats may change during the beta.

## Requirements

- **Claude**, installed and signed in
- A **StockNow account**
- **OAuth authentication** through your browser

## Installation

The plugin is being prepared for public release. Marketplace installation instructions
will be provided once it is available.

## Authentication

After installing the plugin, enter the following in your Claude conversation:

```text
/mcp
```

1. Select the StockNow server and follow the authentication instructions.
2. Sign in to your StockNow account in the browser and approve the requested permissions.
3. Return to Claude to check the connection status and available tools.

Claude manages your credentials. You do not need to enter API keys or tokens manually.

## Usage examples

Once authenticated, ask questions in natural language:

```text
Compare NVIDIA's latest earnings with consensus estimates.
Include the fiscal quarter, units, and data sources.
```

| Research task | Example prompt |
| --- | --- |
| Review earnings | “Compare NVIDIA's last four quarters of earnings and find mentions of networking in its earnings calls.” |
| Read filings | “Find supply chain risk factors in Apple's latest 10-Q and summarize them with links to the original sources.” |
| Catch up on news | “Summarize today's semiconductor market headlines, including each article's publication time and source.” |
| Check your watchlist | “Which stocks on my watchlist report earnings next week, and what are the consensus estimates?” |

Specify the stocks and time period you want to compare. When reviewing the results,
check the as-of date, time zone, currency, fiscal period, and original sources.

## Troubleshooting

- **Authentication required:** Open `/mcp` and sign in to StockNow.
- **Account permission error:** Check the StockNow account you signed in with and the connection permissions you approved.
- **Sign-in flow fails:** See the [Claude MCP authentication guide](https://code.claude.com/docs/en/mcp#authenticate-with-remote-mcp-servers) or contact support.

## Uninstallation

```bash
claude plugin uninstall stocknow@stocknow-plugins
```

To clear your credentials as well, select **Clear authentication** for StockNow in
`/mcp` before uninstalling. Contact StockNow support if you need help managing your
account's connection permissions.

## Contact

StockNow · Tenacious Inc. · [hello@stocknow.ai](mailto:hello@stocknow.ai)
