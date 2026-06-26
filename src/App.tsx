import { useEffect } from "react";
import { hydrateFromStorage } from "./store/bundleStore";
import { BuilderPanel } from "./components/builder/BuilderPanel";
import { ReviewPanel } from "./components/review/ReviewPanel";

function App() {
  useEffect(() => {
    hydrateFromStorage();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 sm:text-left">
          Let's get started!
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="order-1">
            <BuilderPanel />
          </div>
          <div className="order-2 lg:sticky lg:top-8 lg:self-start">
            <ReviewPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
