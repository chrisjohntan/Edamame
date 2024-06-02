import { signOut } from "../auth";
import CardGroupDemo from "../components/CardGroupDemo";
import LoggedNavbar from "../components/LoggedNavbar";


function Dashboard() {
  return (
    <>
    <LoggedNavbar></LoggedNavbar>
    {/* <div>hi</div> */}
    {/* TODO: redirect needs work. this whole component actually */}
    {/* <button onClick={signOut}>Sign out</button> */}
    <CardGroupDemo></CardGroupDemo>
    </>
  )
}

export default Dashboard;