# Araştırma (2026-11-07)

Benzer ürünler, web aramalarıyla bulundu. Yıldız sayıları ve özellikler projelerin kendi anlattığı; tek tek denenmedi. Liste kapsamlı bir tarama değil.

## İlham kaynağı: Atalay's Terminal

[atalaykarahan/atalay-terminal](https://github.com/atalaykarahan/atalay-terminal) (MIT). Claude Code, Codex ve Antigravity oturumları için macOS / Windows paneli.

- macOS: Swift + AppKit + SwiftTerm. Her sohbet ayrık bir `screen` oturumunda çalıştığı için uygulama kapansa da Claude devam ediyor.
- Windows: Electron + xterm.js + node-pty; `screen` yerine kendi oturum sunucusu.
- Panel bir web sayfası (`app/Resources/web`), iki platformda aynı; yörünge haritası three.js.
- Veri: `~/.claude/sessions` (oturum kaydı) ve `~/.claude/projects/*.jsonl` (transcript'ler), yalnız okunur.
- Sosyal kısım (arkadaş, mesaj, XP) kapalı kaynak bir sunucuya bağlı.

## VS Code eklentileri

Çoğu oturum listesi + maliyet gösteriyor; alan kalabalık.

- [Argus](https://marketplace.visualstudio.com/items?itemName=argus-claude.argus-claude): canlı transcript, maliyet, bağlam, döngü uyarısı (MIT)
- [Claude Code Agent Monitor](https://marketplace.visualstudio.com/items?itemName=hoangsonw.claude-code-agent-monitor)
- [Agent Session Watch](https://marketplace.visualstudio.com/items?itemName=HunhNgcCngDanh.agentwatch)
- [Code Sessions](https://marketplace.visualstudio.com/items?itemName=zhirafovod.code-sessions)
- [Claude Code Dashboard](https://open-vsx.org/extension/jspw/claude-code-dashboard)
- [Claude Session Monitor](https://marketplace.visualstudio.com/items?itemName=super-coder-doctor.claude-session-monitor)
- [vscode-claude-sessions](https://github.com/kevin-ghfr/vscode-claude-sessions): birden fazla Claude terminalini yönetiyor
- [Token Watch](https://marketplace.visualstudio.com/items?itemName=alvin0-dinhai.token-watch), [Clusage](https://marketplace.visualstudio.com/items?itemName=Ajax1029.clusage), [Claude Code Usage Tracker](https://marketplace.visualstudio.com/items?itemName=YahyaShareef.claude-code-usage-tracker): kota ve durum çubuğu

## Resmi araçlar

- [`claude agents`](https://code.claude.com/docs/en/agent-view): arka plandaki oturumların tek ekranı
- [VS Code Agents window](https://code.visualstudio.com/docs/agents/run/agents-window)
- [VS Code Agent Host](https://code.visualstudio.com/blogs/2026/08/26/agent-host-architecture): kalıcı oturumlar

## Bağımsız paneller

- [claude-view](https://github.com/tombelieber/claude-view)
- [Stargx/claude-code-dashboard](https://github.com/Stargx/claude-code-dashboard)
- [claude-code-monitor](https://github.com/onikan27/claude-code-monitor) (macOS, mobil web)
- [Tpain166/claude-dashboard](https://github.com/Tpain166/claude-dashboard) (tmux TUI)

## Paralel ajan çalıştırıcılar

- [Claude Squad](https://github.com/smtg-ai/claude-squad), [Parallel Code](https://github.com/johannesjo/parallel-code), [FleetCode](https://github.com/built-by-as/FleetCode), Conductor
- Listeler: [awesome-agent-orchestrators](https://github.com/andyrewlee/awesome-agent-orchestrators), [awesome-cli-coding-agents](https://github.com/bradagi/awesome-cli-coding-agents)

## Kullanım takibi ve terminaller

- ccusage (`npx ccusage blocks --live`), Claude-Code-Usage-Monitor, ccflare, ccstatusline
- [Warp](https://www.warp.dev/articles/best-terminal-for-ai-coding-agents): Claude Code ve Codex'i içinde çalıştırabiliyor; hesap istiyor

## Çıkarım

Oturum listesi + maliyet kalabalık. Az bulunanlar: terminal, sohbet ve izlemenin tek uygulamada birleşmesi; Claude'u verimli kullanmayı öğreten bir modül; görsel, canlı bir genel bakış.

## HeroUI v3 notları

- Güncel sürüm v3.2.7 (28 Ekim 2026). React 19 + Tailwind v4. `npm i @heroui/styles @heroui/react`, Provider gerekmez.
- Tauri / Electron için resmi rehber yok; düz React olduğu için çalışması bekleniyor, denenmedi.
- Komut paleti (Command) yalnız Pro'da; ücretsiz alternatif `cmdk` + Modal.
- Sidebar / Navbar bileşeni bulunamadı (bileşen sayfası tarayıcıda çiziliyor, liste kesin değil).
