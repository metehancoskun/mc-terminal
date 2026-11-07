# Teknik araştırma (2026-11-07)

Kod yazmadan önce üç konu araştırıldı. "Çıkarım" diye işaretlenenler denenmedi; ilk denemede (Aşama 1) doğrulanacak.

## 1. Tauri + HeroUI + xterm.js

**Sonuç: uygulanabilir.**

- **Tauri v2** kararlı. macOS'ta sistemin WKWebView'ını kullanır, Chromium gömmez.
- **Boyut:** bir karşılaştırmada Tauri 8,6 MiB / ~172 MB RAM, Electron 244 MiB / ~409 MB ([kaynak](https://dev.to/gethopp/tauri-vs-electron-performance-bundle-size-and-the-real-trade-offs-1el4)). Beklenti: boyutta 10–30 kat, bellekte ~2 kat avantaj. Çok sekmeli terminalde belleği asıl geri kaydırma (scrollback) tamponu belirler.
- **xterm.js 6** canvas çiziciyi kaldırdı; WebGL ya da DOM kalıyor.
  - Risk: WebKit'te WebGL bağlam sınırı düşük (~8–16). Her terminale ayrı WebGL verilirse 6+ terminalde sınır dolabilir ([örnek](https://github.com/clawterm/ClawTerm/issues/135)). Çözüm: WebGL yalnız görünen terminalde, diğerleri DOM'a düşer.
  - Türkçe Q klavye (ö, ç, ş, ı, Option+harf, ~) ve IME ilk denemede test edilmeli. Türkçeye özel bir hata kaydı bulunamadı.
- **PTY:** `portable-pty` (WezTerm'in) olgun ve yaygın. `tauri-plugin-pty` kendini "geliştirilmekte" diye tanımlıyor; kullanılmayacak.
- **Çıktı akışı:** Tauri olayları (events) JSON ve yüksek hacim için tasarlanmamış. `Channel` hızlı ve sıralı; ham bayt da gönderebiliyor (kaynak koddan, çıkarım). Plan: ayrı okuma iş parçacığı, 4–16 ms'lik paketleme, Channel ile ham bayt, `terminal.write(Uint8Array)`.
- **HeroUI v3:** React 19 + Tailwind v4, `npm i @heroui/styles @heroui/react`, CSS'te önce `@import "tailwindcss";` sonra `@import "@heroui/styles";`. heroui.com'daki Vite sayfası hâlâ v2 içeriği gösteriyor; quick-start izlenecek. Vite için `@tailwindcss/vite`.
- **Gereken Tauri özellikleri** (hepsi var): çoklu pencere, menü çubuğu simgesi, bildirim, güncelleyici, macOS imzalama ve notarization (Apple Developer hesabı, yıllık 99$).
- **VS Code'da aç:** `open -a "Visual Studio Code" <klasör>`. `code` komutu PATH'te olmayabilir.
- **Benzer açık kaynak:** [Terax](https://github.com/crynta/Terax-AI) (Tauri 2 + React 19 + xterm WebGL + portable-pty).

**Kurulum** ([önkoşullar](https://v2.tauri.app/start/prerequisites/)):

1. `xcode-select --install`
2. `curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`, ardından terminali yeniden aç
3. Node LTS (kurulu)

**Başlangıç:** `npm create tauri-app@latest` (React + TypeScript + Vite). Üstüne Tailwind v4, HeroUI, `@xterm/xterm`, `@xterm/addon-webgl`, `@xterm/addon-fit`. Rust tarafında `portable-pty`, `notify`, tray, notification, updater, opener.

## 2. Kalıcı oturum

Amaç: uygulama kapansa, çökse ya da güncellense de terminaller ve Claude çalışmaya devam etsin; açılınca pencere geri bağlansın ve eski çıktı yerinde olsun.

| Seçenek | Geri kaydırma | 24-bit renk | Emek | Not |
|---|---|---|---|---|
| macOS'un `screen` 4.00 | kısmi | bozuk | az | Atalay's Terminal bunu kullanıyor, renkleri 256'ya düşürüyor |
| tmux gömmek | var | var | orta–yüksek | Evrensel statik macOS derlemesi hazır yok; tmux'un kendi ekran modeli xterm.js ile çakışır |
| dtach / abduco | yok | var | az | Yeniden bağlanınca ekran boş gelir |
| **Kendi Rust servisimiz** | **var** | **var** | **yüksek (2–4 hafta, tahmin)** | PTY'leri servis tutar, Unix soket ile konuşur |
| Claude'un kendi kalıcılığı (`claude --bg`, `--resume`) | yok | – | az | Yalnız Claude oturumları; düz terminali kapsamaz |
| zmx / shpool | var | var | orta | Genç projeler; derleme ve macOS desteği belirsiz |

**Öneri: kendi Rust servisimiz.** Uygulamayla aynı dil ve aynı imza zinciri, ek C bağımlılığı yok, tam renk ve kontrollü geri yükleme. Atalay's Terminal'in Windows tarafı aynı modeli kullanıyor (satır başına JSON, replay mesajı, uygulamadan bağımsız başlayan servis).

- **Geri yükleme:** Ham bayt tamponunu bir kaçış dizisinin ortasından oynatmak ekranı bozabilir. Servis içinde bir terminal durum modeli tutulmalı (`vt100` ya da `alacritty_terminal` crate'i, çıkarım).
- **Yedek:** Claude oturumu başlarken oturum kimliği kaydedilir. Servis de ölürse (bilgisayar yeniden başladıysa) `claude --resume` ile konuşma geri açılır.
- **Açık sorular:**
  - Servis launchd ajanı mı olacak, uygulamanın başlattığı bağımsız süreç mi?
  - Güncellemede eski servis ile yeni uygulama nasıl uyumlu kalacak? Protokol sürümü şart.
  - Tauri yardımcı ikilisi (sidecar) uygulama kapanınca ölüyor mu? Test edilecek.

## 3. Claude Code yerel verisi (2.1.319)

Motor yalnız okur, hiçbir dosyaya yazmaz.

**Dizinler** (`~/.claude`)

- `sessions/<pid>.json`: canlı süreç kaydı.
  - Alanlar: `pid`, `sessionId`, `cwd`, `startedAt`, `procStart`, `kind`, `entrypoint` (`cli` | `claude-vscode`), `name`, `updatedAt`, `status`, `statusUpdatedAt`.
  - Aynı klasördeki `.key` dosyalarına dokunulmaz.
- `projects/<kodlanmış-klasör>/<sessionId>.jsonl`: konuşma kaydı.
  - Klasör adındaki harf/rakam dışı her karakter `-` olur ve geri çevrilemez.
  - Gerçek klasör, kayıtlardaki `cwd` alanından okunur.
- `projects/.../<sessionId>/subagents/agent-<id>.jsonl` ve `.meta.json`: alt ajanlar.
  - Meta alanları: `agentType`, `description`, `toolUseId`, `requestShape`.
- `settings.json`: hook'lar ve status line. Kullanıcının mevcut ayarının üzerine yazılmaz, zincirlenir.

**Kayıt tipleri** (`type`)

- `assistant`:
  - `message.id`, `message.model`, `content[]` (thinking, text, `tool_use{id,name,input}`), `stop_reason`.
  - `usage`: `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`.
- **Tuzak:** Bir API yanıtı aynı `message.id` ve aynı `usage` ile birden çok satıra bölünür. Token ve maliyet `message.id` ile tekilleştirilmeli.
- `user`: insan mesajı ya da araç sonucu. Araç sonucunda `permissionDecision{decision: accept|reject}` bulunur; yalnız karar verildikten sonra yazılır.
- `system` (compact_boundary, api_error…), `attachment`, `ai-title`, `custom-title`, `permission-mode`…
- `cost-state`: Claude'un kendi hesapladığı kümülatif maliyet (`totalCostUSD`, model başına `costUSD`). Her oturumda yok; varsa fiyat tablosundan önce bu kullanılır.
- Alt ajan eşleştirme: ana kayıttaki `Agent` `tool_use.id` = alt ajan meta'sındaki `toolUseId`.

**Durum tespiti**

- **Birincil kaynak** `sessions/<pid>.json` içindeki `status`: `busy` = çalışıyor, `waiting` (+ `waitingFor`) = onay bekliyor, `idle` = sıra sende, süreç yoksa bitti.
- **Düzeltme:** `idle` görünse de arka planda alt ajanı çalışan oturum "çalışıyor" sayılır.
- **Hook'lar:** Onay beklemesi konuşma kaydına ayrıca yazılmıyor. Anlık ve güvenilir sinyal için hook'lar kullanılabilir: `PermissionRequest`, `Notification` (`permission_prompt`, `idle_prompt`), `Stop`, `SubagentStop`, `PreToolUse` / `PostToolUse` ([belge](https://code.claude.com/docs/en/hooks)). Kullanıcı izin verirse kurulur ve ayarlardan kapatılabilir.

**Bağlam ve limit**

- **Bağlam doluluğu:** son ana yanıtta `input + cache_read + cache_creation`. Sınır, modelin penceresi ya da otomatik sıkıştırma ayarı (hangisi küçükse).
- **5 saatlik / haftalık limit:**
  - Konuşma kaydında yok.
  - Tek temiz kaynak status line komutuna gelen JSON: `rate_limits.five_hour` ve `seven_day` (`used_percentage`, `resets_at`).
  - Yöntem: kullanıcının status line'ını bozmadan araya giren küçük bir betik, gelen JSON'dan bu değerleri bir dosyaya yazar.

**Okuma yöntemi**

- **İmleç:** Dosya başına konum ve yarım kalan satır tutulur. Dosya büyüdükçe yalnız yeni tam satırlar işlenir; dosya küçülürse başa dönülür.
- **Büyük dosyalar:** Çok büyük dosyada ilk açılışta zamana göre ikili aramayla bugünün başına atlanır.
- **İzleme:** Dosya izleme ve yoklama birlikte kullanılır.

**Diğer tuzaklar**

- Fork, resume ve compact sonrası yeni oturum eskinin kayıtlarını kopyalar; `uuid` ile tekilleştirilmeli.
- Ölü pid kayıtları kalabilir; `pid` + `procStart` ile doğrulanmalı.
- Aynı konuşmayı iki süreç tutabilir; `updatedAt`'ı yeni olan kazanır.
- Bilinmeyen kayıt tipleri ve alanlar sessizce atlanır; Claude Code sürümleri biçimi değiştirebilir.
