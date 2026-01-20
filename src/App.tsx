import { Header } from "./components/Header";
import { CodeComparison } from "./components/CodeComparison";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <CodeComparison />
      </main>
    </div>
  );
}

export default App;
