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
  author: "",
  createdAt: "",
  updatedAt: "",
  isIndexPage: false,
  error: "",
  success: ""
};

class Editpage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  reset() {
    this.setState(initialState);
  }

  onSubmitCreatepage = e => {
    e.preventDefault();
    var key =
      "pages/" +
      (this.props.pageState.title
        ? this.props.pageState.title
        : this.state.title);
    fire
      .database()
      .ref(key)
      .set({
        title: this.props.pageState.title
          ? this.props.pageState.title
          : this.state.title,
        content: this.props.pageState.content
          ? this.props.pageState.content
          : this.state.content,
        status: this.props.pageState.status
          ? this.props.pageState.status
          : this.state.status,
        author: this.props.pageState.author
          ? this.props.pageState.author
          : this.state.author,
        updated_on: moment().format()
      })
      .then(data => {
        this.reset();
        this.setState({ success: "Page is updated successfully" });
        window.location.reload();
        this.props.history.push("/showpages");
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  componentDidMount() {
    let pageId = this.props.match.params.id;
    fire
      .database()
      .ref("/pages")
      .orderByChild("title")
      .equalTo(pageId)
      .on("value", snapshot => {
        snapshot.forEach(userSnapshot => {
          let data = userSnapshot.val();
          this.setState({
            title: data.title,
            content: data.content,
            status: data.status,
            author: data.author
          });
        });
      });
  }
  render() {
    const { title, content, status, error, success } = {
      ...this.state,
      ...this.props.pageState
    };

    return (
      <AUX>
        <form>
          <h1>Edit Page</h1>
          {/* {error ? (
            <div>
              <p style={{ color: "red" }}>{error.message}</p>
            </div>
          ) : null}
          {success ? (
            <div>
              <p style={{ color: "green" }}>{success}</p>
            </div>
          ) : null} */}
          <label htmlFor="title"> Title : </label>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={this.props.onInputChange}
          />
          <br />
          <label htmlFor="content"> Content : </label>
          <FroalaEditor
            tag="textarea"
            model={content}
            onModelChange={this.props.onModelChange}
          />
          <br />
          <label htmlFor="status"> Status : </label>
          <select name="status" onChange={this.props.onInputChange}>
            <option>Select Status</option>
            <option
              value="published"
              selected={status == "published" ? "selected" : null}
            >
              Published
            </option>
            <option
              value="on_Hold"
              selected={status == "on_Hold" ? "selected" : null}
            >
              On Hold
            </option>
          </select>
          <br />
          <button onClick={this.onSubmitCreatepage}>Update Page</button> or
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
)(Editpage);
