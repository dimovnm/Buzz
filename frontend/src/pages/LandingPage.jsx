// import { useNavigate } from "react-router-dom";
import Lights from "../components/Lights";

export default function LandingPage(){
    // const navigate = useNavigate();

    return (
        <>
          <Lights count={12} fixed={true} height={90} />
          <main style={{ padding: 24 }}>
            <h1>Your App</h1>
          </main>
        </>
      );
}
