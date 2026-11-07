# MC Terminal

Claude Code oturumlarını tek ekrandan açan, yöneten ve izleyen hafif bir macOS masaüstü uygulaması.

> **Durum:** planlama aşaması. Henüz kod yok; kararlar [`docs/`](docs/) altında tutuluyor.

## Ne olacak

- **Terminal ve Claude sohbetleri**: projelerin, sohbetlerin ve terminallerin tek uygulamada.
- **Canlı izleme**: hangi oturum çalışıyor, hangisi senden onay bekliyor; token, maliyet, bağlam doluluğu; alt ajanlar ve araç çağrıları.
- **Claude'u verimli kullanma**: duruma göre ipuçları, skill / hook / MCP / `CLAUDE.md` yöneticisi, bilgi bankası, haftalık verim raporu.
- **Özelleştirilebilir**: özelliklerin çoğu ayarlardan açılıp kapatılabilir.
- **VS Code köprüsü**: projeyi VS Code'da aç, VS Code'daki Claude oturumlarını da gör.

Ayrıntı: [özellikler](docs/OZELLIKLER.md) · [kararlar](docs/KARARLAR.md) · [yol haritası](docs/YOL-HARITASI.md) · [araştırma](docs/ARASTIRMA.md)

## Teknoloji (planlanan)

- [Tauri](https://tauri.app) kabuk (hafif, sistemin kendi web görünümü)
- React 19 + [HeroUI v3](https://heroui.com) + Tailwind CSS v4 arayüz
- Önce macOS; Windows sonra

Claude Code dosyaları (`~/.claude`) yalnızca okunur.

## Lisans

[MIT](LICENSE) · Anthropic ile bağlantılı değildir; "Claude" Anthropic'in markasıdır.
