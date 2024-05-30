import { signOut } from "../auth";


function Dashboard() {
  return (
    <>
    <div>hi</div>
    {/* TODO: redirect needs work. this whole component actually */}
    <button onClick={signOut}>Sign out</button>
    
    </>
  )
}

export default Dashboard;