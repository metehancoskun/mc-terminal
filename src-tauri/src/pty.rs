//! Terminal oturumları: her sekme bir PTY + kabuk süreci.
//! Çıktı ham bayt olarak Tauri Channel ile arayüze akar (JSON'a çevrilmez).

use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Mutex;
use std::thread;
use tauri::ipc::{Channel, Response};
use tauri::State;

struct Session {
    master: Box<dyn MasterPty + Send>,
    writer: Box<dyn Write + Send>,
    child: Box<dyn Child + Send + Sync>,
}

impl Drop for Session {
    fn drop(&mut self) {
        let _ = self.child.kill();
    }
}

#[derive(Default)]
pub struct Ptys {
    next: AtomicU32,
    map: Mutex<HashMap<u32, Session>>,
}

fn size(cols: u16, rows: u16) -> PtySize {
    PtySize { rows: rows.max(1), cols: cols.max(1), pixel_width: 0, pixel_height: 0 }
}

#[tauri::command]
pub fn pty_spawn(
    state: State<'_, Ptys>,
    cols: u16,
    rows: u16,
    cwd: Option<String>,
    on_data: Channel<Response>,
    on_exit: Channel<u32>,
) -> Result<u32, String> {
    let pair = native_pty_system().openpty(size(cols, rows)).map_err(|e| e.to_string())?;

    let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/zsh".into());
    let mut cmd = CommandBuilder::new(&shell);
    cmd.arg("-l");
    cmd.env("TERM", "xterm-256color");
    cmd.env("COLORTERM", "truecolor");
    cmd.env("TERM_PROGRAM", "MCTerminal");
    // Finder'dan açılan uygulamada LANG boş gelir; Türkçe karakterler bozulmasın.
    if std::env::var("LANG").map(|v| v.is_empty()).unwrap_or(true) {
        cmd.env("LANG", "en_US.UTF-8");
    }
    if let Some(dir) = cwd.or_else(|| std::env::var("HOME").ok()) {
        cmd.cwd(dir);
    }

    let child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    drop(pair.slave);

    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    let id = state.next.fetch_add(1, Ordering::Relaxed) + 1;

    thread::spawn(move || {
        let mut buf = vec![0u8; 64 * 1024];
        loop {
            match reader.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    if on_data.send(Response::new(buf[..n].to_vec())).is_err() {
                        break;
                    }
                }
            }
        }
        let _ = on_exit.send(id);
    });

    state
        .map
        .lock()
        .map_err(|e| e.to_string())?
        .insert(id, Session { master: pair.master, writer, child });
    Ok(id)
}

#[tauri::command]
pub fn pty_write(state: State<'_, Ptys>, id: u32, data: String) -> Result<(), String> {
    let mut map = state.map.lock().map_err(|e| e.to_string())?;
    let s = map.get_mut(&id).ok_or("oturum yok")?;
    s.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
    s.writer.flush().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn pty_resize(state: State<'_, Ptys>, id: u32, cols: u16, rows: u16) -> Result<(), String> {
    let map = state.map.lock().map_err(|e| e.to_string())?;
    let s = map.get(&id).ok_or("oturum yok")?;
    s.master.resize(size(cols, rows)).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn pty_kill(state: State<'_, Ptys>, id: u32) -> Result<(), String> {
    // Session düşerken Drop kabuğu sonlandırır.
    state.map.lock().map_err(|e| e.to_string())?.remove(&id);
    Ok(())
}
