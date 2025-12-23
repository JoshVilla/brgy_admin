import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketProvider } from "./contexts/WebSocketContext";
export default function Providers({ children }) {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </PersistGate>
      </WebSocketProvider>
    </Provider>
  );
}
