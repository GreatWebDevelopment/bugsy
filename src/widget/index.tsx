import React from 'react';
import { createRoot } from 'react-dom/client';
import BugsyWidget from './BugsyWidget';

interface BugsyInitOptions {
  apiUrl: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  greeting?: string;
}

const Bugsy = {
  init(options: BugsyInitOptions) {
    if (!options.apiUrl) {
      console.error('[Bugsy] apiUrl is required');
      return;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'bugsy-widget-root';
    document.body.appendChild(container);

    // Inject keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bugsySlideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const root = createRoot(container);
    root.render(
      React.createElement(BugsyWidget, {
        apiUrl: options.apiUrl,
        position: options.position || 'bottom-right',
        primaryColor: options.primaryColor || '#7c3aed',
        greeting: options.greeting,
      })
    );
  },
};

(window as any).Bugsy = Bugsy;
