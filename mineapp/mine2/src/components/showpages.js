import React, { Component } from "react";
// import AUX from "./../HOC/AUX";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import Truncate from "react-truncate";
import moment from "moment";
import { connect } from "react-redux";
import _ from "lodash";

class ShowPages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: null,
      sortOrder: "asc",
      filterText: null,
      paginationObj: null
    };
  }

  onDeleteHandler = title => {
    // e.preventDefault();
    fire
      .database()
      .ref(`/pages/${title}`)
      .remove();
    window.location.reload();
  };

  onListenForPages = () => {
    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        this.props.onSetPages(snapshot.val());
        let message = snapshot.val();
        this.setState({ pages: message });
        let msg1 = this.getPaginatedItems(message, 1, 10);
        this.props.onSetPages(message);
        this.setState({ paginationObj: message });

        // let msg = Object.keys(message || {}).map(key => ({
        //   ...message[key],
        //   uid: key
        // }));
        // this.setState({ pages: msg });
        // let msg1 = this.getPaginatedItems(msg, 1, 10);
        //        this.props.onSetPages(msg1.data);
      });
  };

  sortby(sortKey) {
    let sortedObject = _.orderBy(
      this.props.pages,
      sortKey,
      this.state.sortOrder
    );
    this.props.onSetPages(sortedObject);
    if (this.state.sortOrder === "asc") {
      this.setState({ sortOrder: "desc" });
    } else {
      this.setState({ sortOrder: "asc" });
    }
  }

  getPaginatedItems(items, page, pageSize) {
    var pg = page || 1,
      pgSize = pageSize || 100,
      offset = (pg - 1) * pgSize,
      pagedItems = _.drop(items, offset).slice(0, pgSize);
    return {
      page: pg,
      pageSize: pgSize,
      total: items.length,
      total_pages: Math.ceil(items.length / pgSize),
      data: pagedItems
    };
  }

  onSearch = () => {
    var sortedObject;
    if (this.state.filterText === "") {
      sortedObject = this.state.pages;
    } else {
      sortedObject = _.filter(this.props.pages, {
        title: this.state.filterText
      });
    }
    this.props.onSetPages(sortedObject);
  };

  onNextPage(page) {
    let msg1 = this.getPaginatedItems(this.state.pages, page, 3);

    this.props.onSetPages(msg1.data);
    this.setState({ paginationObj: msg1 });
  }

  onChangeFilter = event => {
    this.setState({ filterText: event.target.value });
  };

  componentWillMount() {
    this.onListenForPages();
  }

  render() {
    const { pages } = this.props;
    const { loading, filterText } = this.state;
    const paginationObj = this.state.paginationObj;
    if (!paginationObj) {
      return null;
    }

    const items = [];
    let selected = "";

    for (var i = 1; i <= paginationObj.total_pages; i++) {
      selected = "page-item";
      if (paginationObj.page === i) {
        selected = "page-item active";
      }
      const s = i;

      items.push(
        <li className={selected} key={i}>
          <a className="page-link" onClick={i => this.onNextPage(s)}>
            {i}
          </a>
        </li>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div
            style={{
              width: "100%",
              padding: "10px"
            }}
          >
            <div
              style={{
                width: "20%",
                padding: "10px",
                float: "right"
              }}
            >
              <Link to={"/createpage"} className="btn btn-primary">
                Add Page
              </Link>
              <Link
                style={{ marginLeft: "5px" }}
                to={"/charts"}
                className="btn btn-primary"
              >
                Charts
              </Link>
            </div>
            <div>
              <input
                type="text"
                style={{
                  padding: "10px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  borderRadius: "5px"
                }}
                placeholder="Filter by title"
                onChange={this.onChangeFilter}
                // value={filterText}
              />
              <button
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  width: "80px"
                }}
                onClick={this.onSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="col-md-12">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <a
                      onClick={e => {
                        this.sortby("title");
                      }}
                    >
                      Page
                    </a>
                  </th>
                  <th>
                    <a
                      onClick={e => {
                        this.sortby("content");
                      }}
                    >
                      Content
                    </a>
                  </th>
                  <th>
                    <a
                      onClick={e => {
                        this.sortby("author");
                      }}
                    >
                      Author
                    </a>
                  </th>
                  <th>
                    <a
                      onClick={e => {
                        this.sortby("status");
                      }}
                    >
                      Status
                    </a>
                  </th>
                  <th>
                    <a
                      onClick={e => {
                        this.sortby("updatedAt");
                      }}
                    >
                      Updated On
                    </a>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => {
                  return (
                    <tr key={page.title}>
                      <td>{page.title}</td>
                      <td>
                        <Truncate lines={1} ellipsis={<span>...</span>}>
                          {parse(page.content)}
                        </Truncate>
                      </td>
                      <td>{page.author}</td>
                      <td>
                        {page.status === "on_Hold" ? "On Hold" : "Published"}
                      </td>
                      <td>{moment(page.updated_on).format("MM/DD/YYYY")}</td>
                      <td>
                        <Link
                          to={"editpage/" + page.title}
                          className="nav-link"
                        >
                          <i className="fa fa-edit" aria-hidden="true" />
                        </Link>
                        <a
                          onClick={e => {
                            if (
                              window.confirm(
                                "Are you sure you wish to delete this item?"
                              )
                            )
                              this.onDeleteHandler(page.title);
                          }}
                        >
                          <i className="fa fa-trash" aria-hidden="true" />
                        </a>
                        <Link
                          to={"/preview/" + page.title}
                          className="nav-link"
                        >
                          Preview
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">{items}</ul>
              </nav>
            </div>
            {pages.length == 0 ? <div>No pages found.</div> : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // authUser: state.sessionState.authUser,
  pages: Object.keys(state.pageState.pages || {}).map(key => ({
    ...state.pageState.pages[key],
    uid: key
  }))
  // infoMessage: state.pageState.infoMessage
});

const mapDispatchToProps = dispatch => ({
  onSetPages: pages => dispatch({ type: "PAGES_SET", pages })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowPages);
