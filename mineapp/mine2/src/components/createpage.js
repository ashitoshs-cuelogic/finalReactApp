import React, { Component } from "react";
import AUX from "./../HOC/AUX";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";

import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import FroalaEditor from "react-froala-wysiwyg";
import { connect } from "react-redux";

var moment = require("moment");

const initialState = {
  title: "",
  content: "",
  status: "",
  author: "ashitosh",
  created_on: "",
  updated_on: "",
  isIndexPage: false,
  error: ""
};

class Createpage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmitCreatepage = this.onSubmitCreatepage.bind();
  }

  onSubmitCreatepage = e => {
    e.preventDefault();

    Object.entries(this.props.pageState).forEach(([key, val]) => {
      if (val == null) delete this.props.pageState[key];
    });

    var key = "pages/" + this.props.pageState.title;

    fire
      .database()
      .ref(key)
      .set({
        title: this.props.pageState.title,
        content: this.props.pageState.content,
        status: this.props.pageState.status,
        author: localStorage.getItem("authUser"),
        created_on: moment().format(),
        updated_on: moment().format()
      })
      .then(data => {
        window.location.reload();
        this.props.history.push("/showpages");
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  render() {
    return (
      <AUX>
        <form>
          <h3>Create Page</h3>
          {this.state.error ? (
            <div>
              <p style={{ color: "red" }}>{this.state.error.message}</p>
            </div>
          ) : null}

          <label htmlFor="title"> Title : </label>
          <input
            type="text"
            name="title"
            placeholder="title"
            // value={title}
            onChange={this.props.onInputChange}
          />
          <br />

          <label htmlFor="content"> Content : </label>
          <FroalaEditor
            tag="textarea"
            // model={content}
            onModelChange={this.props.onModelChange}
          />
          <br />

          <label htmlFor="status"> Status : </label>
          <select name="status" onChange={this.props.onInputChange}>
            <option>Select Status</option>
            <option
              value="published"
              // selected={status == "published" ? "selected" : null}
            >
              Published
            </option>
            <option
              value="on_Hold"
              // selected={status == "on_Hold" ? "selected" : null}
            >
              On Hold
            </option>
          </select>
          <br />

          <hr />
          <button onClick={this.onSubmitCreatepage}>Create Page</button>
          <Link to={"/showpages"}> Cancel </Link>
        </form>
      </AUX>
    );
  }
}

const mapStateToProps = state => {
  return {
    pageState: state.authState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInputChange: e =>
      dispatch({
        type: "onChange",
        name: e.target.name,
        value: e.target.value
      }),
    onModelChange: model =>
      dispatch({
        type: "onChange",
        name: "content",
        value: model
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Createpage);
