import React, { Component } from "react";
import AUX from "./../HOC/AUX";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../UI/Spinner";
var moment = require("moment");

const initialState = {
  success: "",
  error: "",
  loading: false
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  reset() {
    this.setState(initialState);
  }

  onSubmitRegister = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    if (
      !this.props.registration.email ||
      !this.props.registration.fullname ||
      !this.props.registration.password
    ) {
      return this.setState({
        error: { message: "Please enter required details" },
        loading: false
      });
    }

    fire
      .auth()
      .createUserWithEmailAndPassword(
        this.props.registration.email,
        this.props.registration.password
      )
      .then(u => {
        var key = "users/" + this.props.registration.fullname;
        fire
          .database()
          .ref(key)
          .set({
            email: this.props.registration.email,
            password: this.props.registration.password,
            fullname: this.props.registration.fullname,
            created_on: moment().format(),
            updated_on: moment().format()
          })
          .then(data => {
            this.reset();
            this.setState({ success: "User registered successfully" });
          })
          .catch(error => {
            this.setState({ error: error, loading: false });
          });
      })
      .catch(error => {
        this.setState({ error: error, loading: false });
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
    const { success, error, loading } = this.state;

    let registrationPage = (
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
              <strong>Register Page</strong>
            </h3>
            {error ? (
              <div>
                <p style={{ color: "red" }}>{error.message}</p>
              </div>
            ) : null}

            {success ? (
              <div>
                <p style={{ color: "green" }}>{success}</p>
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
              <label style={{ width: "20%" }} htmlFor="fullname">
                Full Name :
              </label>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                name="fullname"
                placeholder=" Full Name"
                onChange={this.props.onInputChange}
              />
            </div>

            <div className="form-group">
              <label style={{ width: "20%" }} htmlFor="password">
                Password :
              </label>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                name="password"
                placeholder=" Password"
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
                onClick={this.onSubmitRegister}
              >
                Register
              </button>
              <br />
              or <br />
              <div>
                <span>Already registered </span>
                <Link
                  style={{ color: "#f4a941", fontWeight: "bold" }}
                  to={"/login"}
                >
                  Login
                </Link>
                <span> from here</span>
                <br />
              </div>
              <br />
            </div>
          </div>
        </form>
      </div>
    );

    if (loading) {
      registrationPage = <Spinner />;
    }

    return <AUX>{registrationPage}</AUX>;
  }
}

const mapStateToProps = state => {
  return {
    registration: state.authState
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
)(Register);
