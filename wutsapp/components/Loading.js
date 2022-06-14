import { Circle } from 'better-react-spinkit';

const Loading = () => {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <div>
            <img src="/assets/whatsapp.png" alt="whatsapp" height={200} style={{ marginBottom: 10 }} />
            <Circle color="#3CBC28" size={60} />
        </div>
    </center>
  )
}

export default Loading