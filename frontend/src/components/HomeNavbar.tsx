
function HomeNavbar() {
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
              <a className="nav-link active" aria-current="page" href="/login">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/signup">Sign Up</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;