import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/games': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/downloads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/files': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        }
      }
    }
  }
})
