import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";



function LoggedNavbar() {

  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary flex" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Edamame</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav me-2 mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active btn" onClick={signOut}>Sign Out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default LoggedNavbar;