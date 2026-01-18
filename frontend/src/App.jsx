import Lights from "./components/Lights";

export default function App() {
  return (
    <>
      <Lights count={30} fixed={true} height={90} />
      <main style={{ padding: 24 }}>
        <h1>Your App</h1>
      </main>
    </>
  );
}
