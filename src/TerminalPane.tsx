import { useEffect, useRef } from "react";
import { Channel, invoke } from "@tauri-apps/api/core";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { currentMode, onModeChange, terminalThemes } from "./theme";

export type RendererInfo = "webgl" | "dom";

// WKWebView'de xterm WebGL titreme yapabiliyor; varsayılan DOM çizimi.
// Denemek için geliştirici konsolunda: localStorage.setItem("mc.webgl", "1") ve yeniden yükle.
const useWebgl = (() => {
  try {
    return localStorage.getItem("mc.webgl") === "1";
  } catch {
    return false;
  }
})();

type Props = {
  active: boolean;
  onTitle: (title: string) => void;
  onExit: () => void;
  onRenderer: (r: RendererInfo) => void;
};

// Bir sekme = bir xterm + bir PTY.
// WebGL yalnız görünen sekmede açık (WebKit'te WebGL bağlam sınırı ~8–16).
export default function TerminalPane({ active, onTitle, onExit, onRenderer }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fit = useRef<FitAddon | null>(null);
  const webgl = useRef<WebglAddon | null>(null);
  const cb = useRef({ onTitle, onExit, onRenderer });
  cb.current = { onTitle, onExit, onRenderer };

  useEffect(() => {
    const t = new Terminal({
      fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      allowProposedApi: true,
      scrollback: 10000,
      // Türkçe Q klavyede @ Option+Q ile yazılır; Option'u Meta yapmıyoruz.
      macOptionIsMeta: false,
      theme: terminalThemes[currentMode()],
    });
    const f = new FitAddon();
    t.loadAddon(f);
    t.open(host.current!);
    f.fit();
    term.current = t;
    fit.current = f;

    let id: number | null = null;
    let disposed = false;
    let queue: Promise<unknown> = Promise.resolve();

    const onData = new Channel<ArrayBuffer | number[]>();
    onData.onmessage = (chunk) => {
      t.write(chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : Uint8Array.from(chunk));
    };
    const onExitCh = new Channel<number>();
    // Kabuğu biz kapattıysak (sekme kapandı / bileşen söküldü) sekmeyi tekrar kapatma.
    // Aksi halde StrictMode'un çift bağlaması sonsuz aç-kapa döngüsü yaratır.
    onExitCh.onmessage = () => {
      if (!disposed) cb.current.onExit();
    };

    invoke<number>("pty_spawn", { cols: t.cols, rows: t.rows, cwd: null, onData, onExit: onExitCh })
      .then((pid) => {
        if (disposed) {
          invoke("pty_kill", { id: pid });
          return;
        }
        id = pid;
      })
      .catch((e) => {
        console.warn("[mc] pty_spawn hatası:", String(e));
        t.write(`\r\n\x1b[31mKabuk açılamadı: ${e}\x1b[0m\r\n`);
      });

    // Yazma sırası korunsun diye kuyruk.
    const dataSub = t.onData((d) => {
      if (id === null) return;
      const pid = id;
      queue = queue.then(() => invoke("pty_write", { id: pid, data: d })).catch(() => {});
    });
    const resizeSub = t.onResize(({ cols, rows }) => {
      if (id !== null) invoke("pty_resize", { id, cols, rows }).catch(() => {});
    });
    const titleSub = t.onTitleChange((title) => cb.current.onTitle(title));

    // Boyut değişince en fazla kare başına bir kez ve yalnız ölçü gerçekten değiştiyse sığdır
    // (aksi halde fit → yeniden boyut → fit döngüsü titremeye yol açabilir).
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = host.current;
        if (!el || el.offsetParent === null || el.clientWidth === 0 || el.clientHeight === 0) return;
        const d = f.proposeDimensions();
        if (d && (d.cols !== t.cols || d.rows !== t.rows)) f.fit();
      });
    });
    ro.observe(host.current!);

    // Tanı: saniyede 5'ten fazla yeniden boyutlanma döngü demektir; dev log'a düşer.
    let resizes = 0;
    const diag = setInterval(() => {
      if (resizes > 5) console.warn(`[mc] boyut döngüsü: ${resizes}/sn (${t.cols}x${t.rows})`);
      resizes = 0;
    }, 1000);
    const diagSub = t.onResize(() => resizes++);

    const offMode = onModeChange((m) => {
      t.options.theme = terminalThemes[m];
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(diag);
      diagSub.dispose();
      ro.disconnect();
      offMode();
      dataSub.dispose();
      resizeSub.dispose();
      titleSub.dispose();
      if (id !== null) invoke("pty_kill", { id }).catch(() => {});
      webgl.current?.dispose();
      webgl.current = null;
      t.dispose();
    };
  }, []);

  // Görünürlük değişince: WebGL aç / kapat, boyutu yeniden hesapla, odaklan.
  useEffect(() => {
    const t = term.current;
    if (!t) return;
    if (active) {
      if (!useWebgl) {
        cb.current.onRenderer("dom");
      } else if (!webgl.current) {
        try {
          const w = new WebglAddon();
          w.onContextLoss(() => {
            w.dispose();
            webgl.current = null;
            cb.current.onRenderer("dom");
          });
          t.loadAddon(w);
          webgl.current = w;
          cb.current.onRenderer("webgl");
        } catch {
          cb.current.onRenderer("dom");
        }
      } else {
        cb.current.onRenderer("webgl");
      }
      requestAnimationFrame(() => {
        fit.current?.fit();
        t.focus();
      });
    } else if (webgl.current) {
      webgl.current.dispose();
      webgl.current = null;
    }
  }, [active]);

  return <div ref={host} className="h-full w-full" style={{ display: active ? "block" : "none" }} />;
}
