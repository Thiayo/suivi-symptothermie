module.exports = {
  ci: {
    collect: {
      startServerCommand: 'python3 -m http.server 4173 --bind 127.0.0.1',
      startServerReadyPattern: 'Serving HTTP on',
      startServerReadyTimeout: 10000,
      url: ['http://127.0.0.1:4173/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.70 }],
        'categories:accessibility': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.90 }],
        'categories:seo': ['warn', { minScore: 0.80 }],
        'categories:pwa': 'off',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
    },
  },
};
