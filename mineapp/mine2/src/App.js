import React, { Component } from "react";
import logo from "./assets/logo.png";
import icon from "./assets/home.png";
import fire from "./config/firebase";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import CreatePage from "./components/createpage";
import EditPage from "./components/editpage";
import ShowPages from "./components/showpages";
import Preview from "./components/preview";
import CustomPieChart from "./charts/piechart";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import "./App.css";
import "./bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: null,
      loading: false
    };
  }

  logoutHandler = () => {
    localStorage.removeItem("authUser");
    // window.location.reload();
    this.forceUpdate();
  };

  componentDidMount() {
    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        let message = snapshot.val();
        const msg = Object.keys(message || {}).map(key => ({
          ...message[key]
        }));
        this.setState({ pages: msg });
      });
  }

  render() {
    const { pages } = this.state;
    const loggedInUser = localStorage.getItem("authUser");
    if (!pages) {
      return null;
    }

    var sources = [];
    pages.map(function(img) {
      if (img.status === "published") {
        sources.push(img);
      }
    });

    return (
      <div className="App">
        <Router>
          <div>
            <img
              src={logo}
              style={{ width: "100px", height: "100px", float: "left" }}
            />
            <br />
            <h2 style={{ display: "inline" }}>My App </h2>
          </div>
          <br />
          <br />
          <div style={{ width: "100%" }}>
            <div
              className="navbar-collapse"
              style={{
                border: "1px solid gray",
                background: "green",
                borderLeft: "1px solid gray"
              }}
            >
              <ul
                style={{
                  listStyleType: "none",
                  padding: "12px"
                }}
              >
                <li
                  style={{
                    display: "inline",
                    float: "left"
                  }}
                >
                  <NavLink
                    style={{
                      color: "white",
                      padding: "5px",
                      textDecoration: "none"
                    }}
                    to="/"
                    exact
                    activeClassName="active"
                  >
                    <img
                      src={icon}
                      style={{ width: "20px", height: "20px", float: "left" }}
                    />
                  </NavLink>
                </li>
                {sources.map(page => (
                  <span>
                    <li
                      style={{
                        display: "inline",
                        float: "left",
                        borderLeft: "1px solid gray"
                      }}
                    >
                      <NavLink
                        style={{
                          color: "white",
                          padding: "10px",
                          textDecoration: "none"
                        }}
                        to={"/preview/" + page.title}
                        exact
                        activeClassName="active"
                      >
                        <span className="glyphicon glyphicon-home" />
                        {page.title}
                      </NavLink>
                    </li>
                  </span>
                ))}

                {loggedInUser ? (
                  <div>
                    <li
                      style={{
                        display: "inline",
                        float: "right"
                      }}
                    >
                      <NavLink
                        onClick={this.logoutHandler}
                        style={{
                          color: "white",
                          padding: "5px",
                          textDecoration: "none"
                        }}
                        to="/"
                        exact
                        activeClassName="active"
                      >
                        Logout
                      </NavLink>
                    </li>

                    <li
                      style={{
                        display: "inline",
                        float: "right",
                        borderRight: "1px solid gray",
                        borderLeft: "1px solid gray"
                      }}
                    >
                      <NavLink
                        style={{
                          color: "white",
                          padding: "5px",
                          textDecoration: "none"
                        }}
                        to="/showpages"
                        exact
                        activeClassName="active"
                      >
                        Manage Pages
                      </NavLink>
                    </li>
                  </div>
                ) : (
                  <div>
                    <li
                      style={{
                        display: "inline",
                        float: "right"
                      }}
                    >
                      <NavLink
                        style={{
                          color: "white",
                          padding: "5px",
                          textDecoration: "none"
                        }}
                        to="/login"
                        exact
                        activeClassName="active"
                      >
                        Login
                      </NavLink>
                    </li>
                    <li
                      style={{
                        display: "inline",
                        float: "right",
                        borderRight: "1px solid gray"
                      }}
                    >
                      <NavLink
                        style={{
                          color: "white",
                          padding: "5px",
                          textDecoration: "none"
                        }}
                        to="/register"
                        exact
                        activeClassName="active"
                      >
                        Register
                      </NavLink>
                    </li>
                  </div>
                )}
              </ul>
            </div>

            <br />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/createpage" component={CreatePage} />
              <Route path="/editpage/:id" component={EditPage} />
              <Route path="/showpages" component={ShowPages} />
              <Route path="/preview/:id" component={Preview} />
              <Route path="/charts" component={CustomPieChart} />
              <Route component={Page404} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const Page404 = ({ location }) => (
  <div>
    <h2>
      No match found for <code>{location.pathname}</code>
    </h2>
  </div>
);
export default App;
