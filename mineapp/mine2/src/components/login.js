import React, { Component } from "react";
import fire from "./../config/firebase";
import AUX from "./../HOC/AUX";
import { Link } from "react-router-dom";
import Spinner from "../UI/Spinner";
import { connect } from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: false
    };
  }

  onSubmitLogin = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    if (!this.props.authState.email || !this.props.authState.password) {
      return this.setState({
        error: { message: "Please enter required details" },
        loading: false
      });
    }

    fire
      .auth()
      .signInWithEmailAndPassword(
        this.props.authState.email,
        this.props.authState.password
      )
      .then(u => {
        localStorage.setItem("authUser", this.props.authState.email);
        this.setState({
          loading: false
        });
        window.location.href = "/";
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false
        });
      });
  };

  componentWillMount() {
    this.setState({
      loading: true
    });
  }
  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { error, loading } = this.state;

    let loginPage = (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "5px",
          // display: "flex",
          justifyContent: "center"
        }}
      >
        <form>
          <div
            style={{
              width: "40%",
              marginTop: "50px",
              background: "gray",
              borderRadius: "5px",
              alignContent: "center",
              justifyContent: "center",
              marginLeft: "30%",
              color: "white"
            }}
          >
            <br />
            <h3>
              <strong>Login Page</strong>
            </h3>
            {error ? (
              <div>
                <p style={{ color: "red" }}>{error.message}</p>
              </div>
            ) : null}
            <div style={{ marginTop: "20px" }} className="form-group">
              <label style={{ width: "20%" }} htmlFor="email">
                Email :
              </label>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                name="email"
                placeholder=" Email"
                onChange={this.props.onInputChange}
              />
            </div>
            <div className="form-group">
              <label style={{ width: "20%" }} htmlFor="password">
                password :
              </label>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                name="password"
                placeholder=" Password"
                // value={this.props.authState.password}
                onChange={this.props.onInputChange}
              />
            </div>
            <div className="form-group">
              <button
                style={{
                  width: "70px",
                  borderRadius: "5px",
                  background: "green",
                  borderStyle: "none",
                  padding: "5px",
                  color: "white"
                }}
                onClick={this.onSubmitLogin}
              >
                Login
              </button>
              <br />
              or <br />
              Do
              <Link to={"/register"}> Register </Link>
              here.
            </div>
            <br />
          </div>
        </form>
      </div>
    );

    if (loading) {
      loginPage = <Spinner />;
    }

    return <AUX>{loginPage}</AUX>;
  }
}

const mapStateToProps = state => {
  return {
    authState: state.authState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInputChange: e =>
      dispatch({
        type: "onChange",
        name: e.target.name,
        value: e.target.value
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
