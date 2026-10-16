# StockNow for Claude Code

**Claude Code에서 StockNow의 주가, 실적, 뉴스와 SEC 공시를 대화로 조회하세요.**

StockNow MCP 서버를 연결하는 Claude Code 플러그인입니다. StockNow PRO 계정으로
인증하면 기업 실적을 비교하고, 공시와 실적 발표 콜을 읽고, 관심 종목의 뉴스를
대화 안에서 살펴볼 수 있습니다.

[StockNow](https://stocknow.ai/ko) · [English](https://stocknow.ai/en) · [MCP 소개](https://stocknow.ai/en/mcp)

## 주요 기능

| 분야 | 조회할 수 있는 내용 |
| --- | --- |
| 주가·지수 | 종목 현재가, 과거 가격 추이, 주요 지수 움직임 |
| 실적 | 발표 일정, EPS 컨센서스, 실제 발표 결과 |
| 실적 발표 콜 | 전체 트랜스크립트 검색과 본문 |
| SEC 공시 | 10-K·10-Q·8-K 공시 본문 |
| 뉴스 | 날짜·종목·키워드에 따른 시장 속보와 기업 뉴스 |
| 재무·스크리너 | 재무제표, 주요 비율, 배당, 공매도 데이터와 조건별 종목 탐색 |
| 관심 종목 | StockNow 계정에 저장된 관심 종목 |

StockNow가 호스팅하는 MCP 서버에 **Streamable HTTP**로 연결합니다.

```text
https://mcp.stocknow.ai/mcp
```

지원 범위는 [StockNow MCP 안내](https://stocknow.ai/en/mcp)에서 확인할 수 있습니다.
베타 기간에는 제공 도구와 응답 형식이 바뀔 수 있습니다.

## 사용 조건

- 설치 및 로그인을 마친 **Claude Code**
- **StockNow PRO 계정**
- 브라우저를 통한 **OAuth 인증**

## 설치

플러그인의 공개 배포를 준비하고 있습니다. marketplace 설치 명령은 배포가 완료되면
안내할 예정입니다.

## 인증

플러그인을 설치한 뒤 Claude Code 대화창에서 다음을 입력합니다.

```text
/mcp
```

1. StockNow 서버를 선택하고 인증 안내를 따릅니다.
2. 브라우저에서 StockNow PRO 계정으로 로그인하고 요청된 권한을 승인합니다.
3. Claude Code로 돌아와 연결 상태와 사용 가능한 도구를 확인합니다.

인증 정보는 Claude Code가 관리합니다. API 키나 토큰을 직접 입력할 필요가 없습니다.

## 사용 예제

인증을 마친 뒤 자연어로 질문하세요.

```text
NVIDIA의 최근 실적을 컨센서스와 비교해줘.
비교한 회계 분기, 수치의 단위와 데이터 출처도 알려줘.
```

| 하고 싶은 일 | 질문 예시 |
| --- | --- |
| 기업 실적 점검 | “NVIDIA의 최근 4개 분기 실적을 비교하고, 발표 콜에서 networking을 언급한 부분을 찾아줘.” |
| 공시 읽기 | “Apple의 최신 10-Q에서 공급망 관련 위험 요인을 찾아서 원문 출처와 함께 요약해줘.” |
| 시장 뉴스 정리 | “오늘 반도체 관련 시장 속보를 정리하고 기사별 발표 시각과 출처를 붙여줘.” |
| 관심 종목 확인 | “내 관심 종목 중 다음 주 실적 발표 예정인 기업과 컨센서스를 정리해줘.” |

비교하려는 종목과 기간을 함께 지정하면 더 구체적으로 질문할 수 있습니다.
결과를 확인할 때는 기준일·시간대·통화·회계 기간과 원문 출처를 함께 살펴보세요.

## 연결이 안 될 때

- **인증이 필요한 경우:** `/mcp`에서 StockNow 로그인을 진행하세요.
- **PRO 권한 오류가 발생하는 경우:** 로그인한 계정의 StockNow PRO 구독 상태를 확인하세요.
- **로그인 흐름이 실패하는 경우:** [Claude Code MCP 인증 안내](https://code.claude.com/docs/en/mcp#authenticate-with-remote-mcp-servers)를 확인하거나 지원팀에 문의하세요.

## 제거

```bash
claude plugin uninstall stocknow@stocknow-plugins
```

인증 정보도 해제하려면 제거 전에 `/mcp`에서 StockNow의 **Clear authentication**을
선택하세요. 계정의 연결 권한 관리가 필요하면 StockNow 지원팀에 문의하세요.

## 문의

StockNow · Tenacious Inc. · [hello@stocknow.ai](mailto:hello@stocknow.ai)
