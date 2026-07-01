import { notificationService } from "../notification";

export const fileService = {
  download: (content: string, filename: string, type: string = 'application/json') => {
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notificationService.success(`Downloaded ${filename}`);
    } catch {
      notificationService.error(`Failed to download ${filename}`);
    }
  },

  upload: (accept: string = '.json'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            notificationService.success(`Uploaded ${file.name}`);
            resolve(result);
          } else {
            notificationService.error('Failed to read file');
            reject(new Error('Failed to read file as text'));
          }
        };
        reader.onerror = () => {
          notificationService.error('Error reading file');
          reject(new Error('Error reading file'));
        };
        reader.readAsText(file);
      };

      input.click();
    });
  }
};
