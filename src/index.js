import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Server 
} from 'lucide-react';


const persistConfig = { 
  key: "echocircle-root", 
  storage, 
  version: 1,
  whitelist: ['user', 'token', 'posts'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV === 'development',
});

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 blur-xl opacity-30"></div>
        <div className="relative p-6 bg-neutral-950/95 rounded-2xl border border-red-900/70 shadow-[0_0_40px_rgba(127,29,29,0.6)]">
          <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-4">
            <Server size={32} className="text-black" />
          </div>
          <Loader2 size={48} className="text-red-500 animate-spin mx-auto" />
        </div>
      </div>
      {/* rest unchanged */}
    </div>
  </div>
);


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-neutral-950 rounded-2xl border border-red-900/70 shadow-[0_0_40px_rgba(127,29,29,0.6)] p-8 text-center">
              <div className="p-4 bg-red-950/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-red-900/50">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-50 mb-3">
                Something went wrong
              </h1>
              <p className="text-neutral-400 mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-red-600 text-black font-semibold rounded-xl hover:bg-red-500 shadow-[0_0_20px_rgba(248,113,113,0.4)] transition-all"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full py-3 bg-neutral-800/50 text-neutral-200 font-medium rounded-xl hover:bg-neutral-800 border border-red-900/50 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PerformanceMonitor = ({ children }) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      const handleLoad = () => {
        const loadTime = performance.now() - startTime;
        console.log(`🚀 EchoCircle loaded in ${loadTime.toFixed(2)}ms`);
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return children;
};

const Root = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <PerformanceMonitor>
          <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistStore(store)}>
              <App />
            </PersistGate>
          </Provider>
        </PerformanceMonitor>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
      <div style="background: #0f0f0f; padding: 3rem; border-radius: 1rem; text-align: center; max-width: 400px; border: 1px solid #3f3f46;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #9ca3af; margin-bottom: 2rem;">Root element not found.</p>
        <button onclick="location.reload()" style="background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
          Reload Application
        </button>
      </div>
    </div>
  `;
} else {
  const root = ReactDOM.createRoot(rootElement);
  try {
    root.render(<Root />);
    console.log('✅ EchoCircle rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render application:', error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
        <div style="background: #0f0f0f; padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; max-width: 400px; border: 1px solid #3f3f46;">
          <h2 style="font-size: 1.5rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Render Error</h2>
          <p style="color: #9ca3af; margin-bottom: 1.5rem;">Failed to render EchoCircle.</p>
          <button onclick="location.reload()" style="width: 100%; background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">
            Reload Application
          </button>
        </div>
      </div>
    `;
  }
}

export { store };



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import authReducer from "./state";
// import { configureStore } from '@reduxjs/toolkit';
// import { Provider } from "react-redux";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { PersistGate } from "redux-persist/integration/react";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { 
//   CircleLoader, 
//   AlertCircle, 
//   CheckCircle,
//   Server 
// } from 'lucide-react';

// // Enhanced persist configuration
// const persistConfig = { 
//   key: "echocircle-root", 
//   storage, 
//   version: 1,
//   whitelist: ['user', 'token', 'posts'], // Only persist these slices
//   migrate: (state) => {
//     // Migration logic for future state changes
//     if (!state) return Promise.resolve(undefined);
//     // Add migration logic here when state structure changes
//     return Promise.resolve(state);
//   }
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// // Configure store with enhanced middleware
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//       // Add performance monitoring in development
//       ...(process.env.NODE_ENV === 'development' && {
//         immutableCheck: { warnAfter: 128 },
//         serializableCheck: { warnAfter: 128 },
//       }),
//     }),
//   // Enable Redux DevTools in development
//   devTools: process.env.NODE_ENV === 'development',
// });

// // Create a custom theme for MUI
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#2563eb', // Blue-600
//       light: '#60a5fa', // Blue-400
//       dark: '#1d4ed8', // Blue-700
//     },
//     secondary: {
//       main: '#7c3aed', // Violet-600
//       light: '#a78bfa', // Violet-400
//       dark: '#5b21b6', // Violet-800
//     },
//     success: {
//       main: '#10b981', // Emerald-500
//       light: '#34d399', // Emerald-400
//       dark: '#059669', // Emerald-600
//     },
//     warning: {
//       main: '#f59e0b', // Amber-500
//       light: '#fbbf24', // Amber-400
//       dark: '#d97706', // Amber-600
//     },
//     error: {
//       main: '#ef4444', // Red-500
//       light: '#f87171', // Red-400
//       dark: '#dc2626', // Red-600
//     },
//     background: {
//       default: '#f9fafb', // Gray-50
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#111827', // Gray-900
//       secondary: '#6b7280', // Gray-500
//     },
//     divider: '#e5e7eb', // Gray-200
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontSize: '2.5rem',
//       fontWeight: 700,
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontSize: '2rem',
//       fontWeight: 600,
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontSize: '1.75rem',
//       fontWeight: 600,
//       lineHeight: 1.4,
//     },
//     h4: {
//       fontSize: '1.5rem',
//       fontWeight: 600,
//       lineHeight: 1.5,
//     },
//     h5: {
//       fontSize: '1.25rem',
//       fontWeight: 500,
//       lineHeight: 1.6,
//     },
//     h6: {
//       fontSize: '1rem',
//       fontWeight: 500,
//       lineHeight: 1.7,
//     },
//     button: {
//       textTransform: 'none',
//       fontWeight: 500,
//     },
//   },
//   shape: {
//     borderRadius: 12, // Consistent with your design
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: 'none',
//           '&:hover': {
//             boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
//           },
//         },
//         contained: {
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
//         },
//       },
//     },
//   },
// });

// // Custom loading component for PersistGate
// const LoadingScreen = () => (
//   <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//     <div className="text-center">
//       <div className="relative mb-6">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 blur-xl opacity-20"></div>
//         <div className="relative p-6 bg-white rounded-2xl border border-gray-200 shadow-lg">
//           <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4">
//             <Server size={32} className="text-white" />
//           </div>
//           <CircleLoader size={48} className="text-blue-500 animate-spin mx-auto" />
//         </div>
//       </div>
//       <div className="space-y-3">
//         <h2 className="text-xl font-semibold text-gray-900">EchoCircle</h2>
//         <p className="text-gray-600">Loading your experience...</p>
//         <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
//           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
//           <span>Connecting to services</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Error boundary component
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Application error:', error, errorInfo);
//     // You can log to an error reporting service here
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
//           <div className="max-w-md w-full">
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
//               <div className="p-4 bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//                 <AlertCircle size={32} className="text-red-500" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-3">
//                 Something went wrong
//               </h1>
//               <p className="text-gray-600 mb-6">
//                 We encountered an unexpected error. Please try refreshing the page.
//               </p>
//               <div className="space-y-4">
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
//                 >
//                   Refresh Page
//                 </button>
//                 <button
//                   onClick={() => this.setState({ hasError: false })}
//                   className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//               <div className="mt-8 pt-6 border-t border-gray-100">
//                 <p className="text-sm text-gray-500">
//                   If the problem persists, contact support
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // Performance monitoring wrapper
// const PerformanceMonitor = ({ children }) => {
//   React.useEffect(() => {
//     if (process.env.NODE_ENV === 'development') {
//       const startTime = performance.now();
      
//       const handleLoad = () => {
//         const loadTime = performance.now() - startTime;
//         console.log(`🚀 App loaded in ${loadTime.toFixed(2)}ms`);
        
//         // Log performance metrics
//         if ('performance' in window) {
//           const perfEntries = performance.getEntriesByType('navigation');
//           if (perfEntries.length > 0) {
//             const navEntry = perfEntries[0];
//             console.log('📊 Performance metrics:', {
//               DNS: navEntry.domainLookupEnd - navEntry.domainLookupStart,
//               TCP: navEntry.connectEnd - navEntry.connectStart,
//               TTFB: navEntry.responseStart - navEntry.requestStart,
//               DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
//               Load: navEntry.loadEventEnd - navEntry.loadEventStart,
//             });
//           }
//         }
//       };

//       if (document.readyState === 'complete') {
//         handleLoad();
//       } else {
//         window.addEventListener('load', handleLoad);
//         return () => window.removeEventListener('load', handleLoad);
//       }
//     }
//   }, []);

//   return children;
// };

// // Root component with all providers
// const Root = () => {
//   const [storeReady, setStoreReady] = React.useState(false);

//   React.useEffect(() => {
//     // Store initialization complete
//     setStoreReady(true);
    
//     // Log initialization
//     console.log('🔄 Store initialized successfully');
//   }, []);

//   return (
//     <React.StrictMode>
//       <ErrorBoundary>
//         <PerformanceMonitor>
//           <Provider store={store}>
//             <PersistGate loading={<LoadingScreen />} persistor={persistStore(store)}>
//               <ThemeProvider theme={theme}>
//                 <CssBaseline />
//                 {storeReady && <App />}
//               </ThemeProvider>
//             </PersistGate>
//           </Provider>
//         </PerformanceMonitor>
//       </ErrorBoundary>
//     </React.StrictMode>
//   );
// };

// // Root element
// const rootElement = document.getElementById('root');

// if (!rootElement) {
//   console.error('❌ Root element not found');
//   // Create a fallback display
//   document.body.innerHTML = `
//     <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
//       <div style="background: white; padding: 3rem; border-radius: 1rem; text-align: center; max-width: 400px;">
//         <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
//         <p style="color: #6b7280; margin-bottom: 2rem;">Root element not found. Please check your HTML structure.</p>
//         <button onclick="location.reload()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
//           Reload Application
//         </button>
//       </div>
//     </div>
//   `;
// } else {
//   const root = ReactDOM.createRoot(rootElement);
  
//   // Render with error handling
//   try {
//     root.render(<Root />);
    
//     // Log successful render
//     console.log('✅ Application rendered successfully');
    
//     // Service worker registration (optional)
//     if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
//       window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js').then(
//           (registration) => {
//             console.log('📱 ServiceWorker registered:', registration.scope);
//           },
//           (error) => {
//             console.log('📱 ServiceWorker registration failed:', error);
//           }
//         );
//       });
//     }
//   } catch (error) {
//     console.error('❌ Failed to render application:', error);
    
//     // Fallback rendering
//     rootElement.innerHTML = `
//       <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);">
//         <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); text-align: center; max-width: 400px;">
//           <div style="margin-bottom: 1.5rem;">
//             <div style="display: inline-block; padding: 1rem; background: #fef2f2; border-radius: 9999px;">
//               <svg style="width: 3rem; height: 3rem; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//               </svg>
//             </div>
//           </div>
//           <h2 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">Render Error</h2>
//           <p style="color: #6b7280; margin-bottom: 1.5rem;">Failed to render the application. Please check the console for details.</p>
//           <button onclick="location.reload()" style="width: 100%; background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: background 0.2s;">
//             Reload Application
//           </button>
//         </div>
//       </div>
//     `;
//   }
// }

// // Export for testing
// export { store, theme };

// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import './index.css';
// // import App from './App';
// // import authReducer from "./state";
// // import { configureStore } from '@reduxjs/toolkit';
// // import { Provider } from "react-redux";
// // import {
// //   persistStore,
// //   persistReducer,
// //   FLUSH,
// //   REHYDRATE,
// //   PAUSE,
// //   PERSIST,
// //   PURGE,
// //   REGISTER
// // } from "redux-persist";
// // import storage from "redux-persist/lib/storage";
// // import {PersistGate} from "redux-persist/integration/react";

// // const persistConfig = { key: "root", storage, version: 1};
// // const persistedReducer = persistReducer(persistConfig, authReducer);
// // const store = configureStore({
// //   reducer: persistedReducer,
// //   middleware: (getDefaultMiddleware) =>
// //     getDefaultMiddleware({
// //       serializableCheck: {
// //         ignoredActions:[ FLUSH,
// //           REHYDRATE,
// //           PAUSE,
// //           PERSIST,
// //           PURGE,
// //           REGISTER ],
// //       },
// //     }),
// // });


// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(
// //   <React.StrictMode>
// //     <Provider store={store}>
// //       <PersistGate  loading={null} persistor={persistStore(store)}>
// //       <App />
// //       </PersistGate>
// //     </Provider>
// //   </React.StrictMode>
// // );

