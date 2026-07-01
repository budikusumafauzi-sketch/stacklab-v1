type ShortcutHandler = (e: KeyboardEvent) => void;

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: ShortcutHandler;
}

class ShortcutManager {
  private shortcuts: Shortcut[] = [];
  private isListening = false;

  register(shortcut: Shortcut) {
    this.shortcuts.push(shortcut);
    if (!this.isListening) {
      this.start();
    }
    return () => this.unregister(shortcut);
  }

  private unregister(shortcut: Shortcut) {
    this.shortcuts = this.shortcuts.filter(s => s !== shortcut);
    if (this.shortcuts.length === 0) {
      this.stop();
    }
  }

  private start() {
    window.addEventListener("keydown", this.handleKeyDown);
    this.isListening = true;
  }

  private stop() {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.isListening = false;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const matched = this.shortcuts.find(s => {
      const matchKey = e.key.toLowerCase() === s.key.toLowerCase();
      const matchCtrl = s.ctrlKey === undefined || !!s.ctrlKey === (e.ctrlKey || e.metaKey);
      const matchShift = s.shiftKey === undefined || !!s.shiftKey === e.shiftKey;
      const matchAlt = s.altKey === undefined || !!s.altKey === e.altKey;
      return matchKey && matchCtrl && matchShift && matchAlt;
    });

    if (matched) {
      e.preventDefault();
      matched.handler(e);
    }
  };
}

export const shortcutManager = new ShortcutManager();
