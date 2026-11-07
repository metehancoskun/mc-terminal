import { useCallback, useEffect, useState } from "react";
import { Button, Chip, Kbd } from "@heroui/react";
import TerminalPane, { RendererInfo } from "./TerminalPane";

type Tab = { id: number; title: string };

let nextId = 1;
const newTab = (): Tab => ({ id: nextId++, title: "zsh" });

// Aşama 1 denemesi: K17 yerleşiminin iskeleti (kenar çubuğu + sekmeler + detay paneli)
// ve gerçek bir terminal. Kenar çubuğu ile detay paneli şimdilik yer tutucu.
export default function App() {
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab()]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const [renderer, setRenderer] = useState<RendererInfo>("dom");

  const add = useCallback(() => {
    const t = newTab();
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
  }, []);

  const close = useCallback((id: number) => {
    setTabs((ts) => {
      const i = ts.findIndex((t) => t.id === id);
      const rest = ts.filter((t) => t.id !== id);
      if (rest.length === 0) {
        const t = newTab();
        setActiveId(t.id);
        return [t];
      }
      setActiveId((cur) => (cur === id ? rest[Math.max(0, i - 1)].id : cur));
      return rest;
    });
  }, []);

  const rename = useCallback((id: number, title: string) => {
    setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, title: title || "zsh" } : t)));
  }, []);

  // K38 ilk kısayollar: ⌘T yeni sekme, ⌘1–9 sekmeye git. (⌘W şimdilik pencereyi kapatıyor; menü Aşama 2'de.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey || e.altKey || e.ctrlKey) return;
      if (e.key === "t") {
        e.preventDefault();
        add();
      } else if (/^[1-9]$/.test(e.key)) {
        const t = tabs[Number(e.key) - 1];
        if (t) {
          e.preventDefault();
          setActiveId(t.id);
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [tabs, add]);

  return (
    <div className="flex h-full">
      <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-separator bg-background-secondary p-3 max-[900px]:w-12 max-[900px]:items-center max-[900px]:p-2">
        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted max-[900px]:hidden">
          Projeler
        </div>
        <div className="rounded-lg px-2 py-1.5 text-muted max-[900px]:hidden">Aşama 3'te gelecek</div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-end gap-1 border-b border-separator px-2">
          {tabs.map((t, i) => (
            <div
              key={t.id}
              role="tab"
              aria-selected={t.id === activeId}
              onMouseDown={() => setActiveId(t.id)}
              className={
                "group flex h-8 max-w-52 cursor-default items-center gap-2 rounded-t-lg px-3 " +
                (t.id === activeId ? "bg-surface font-medium" : "text-muted hover:bg-surface-secondary")
              }
            >
              <span className="truncate">{t.title}</span>
              {i < 9 && <span className="text-[10px] text-muted">⌘{i + 1}</span>}
              <button
                aria-label="Sekmeyi kapat"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => close(t.id)}
                className="rounded px-1 text-muted opacity-0 hover:bg-default group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
          <Button size="sm" variant="ghost" isIconOnly aria-label="Yeni sekme" onPress={add} className="mb-1">
            +
          </Button>
        </div>
        <div className="relative min-h-0 flex-1 bg-surface">
          {tabs.map((t) => (
            <TerminalPane
              key={t.id}
              active={t.id === activeId}
              onTitle={(title) => rename(t.id, title)}
              onExit={() => close(t.id)}
              onRenderer={(r) => t.id === activeId && setRenderer(r)}
            />
          ))}
        </div>
      </main>

      <aside className="flex w-72 shrink-0 flex-col gap-3 border-l border-separator bg-background-secondary p-4 max-[1100px]:hidden">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Aşama 1 denemesi</div>
        <div className="flex flex-col gap-2">
          <Row label="Çizim">
            <Chip size="sm" color={renderer === "webgl" ? "success" : "warning"}>
              {renderer === "webgl" ? "WebGL" : "DOM"}
            </Chip>
          </Row>
          <Row label="Açık sekme">
            <span className="font-mono">{tabs.length}</span>
          </Row>
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Kısayollar</div>
        <Row label="Yeni sekme">
          <Kbd>⌘T</Kbd>
        </Row>
        <Row label="Sekmeye git">
          <Kbd>⌘1–9</Kbd>
        </Row>
        <div className="mt-auto text-xs text-muted">
          Denenecekler: Türkçe karakterler (ğüşiöç), Option+Q ile @, <span className="font-mono">claude</span>,{" "}
          <span className="font-mono">vim</span>, 10+ sekme.
        </div>
      </aside>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted">{label}</span>
      {children}
    </div>
  );
}
