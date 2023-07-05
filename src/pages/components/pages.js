import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import pagesModel from "../pages";

import "./css/rules.scss";

class Page extends React.PureComponent {
  componentDidMount() {
    pagesModel.getPage(this.props);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.language !== this.props.language ||
      prevProps.contentPage !== this.props.contentPage
    ) {
      pagesModel.getPage(this.props);
    }
  }
  render() {
    const { page } = this.props;

    if (!page) {
      return "";
    }

    return (
      <div className="main__body">
        <Helmet>
          <title>{page.seo_title || page.title}</title>
          <meta
            name="description"
            content={page.seo_description || page.title}
          />
          <meta name="keywords" content={page.seo_keywords || page.title} />
        </Helmet>
        <h2 className="h_decor">{page.title}</h2>
        <div
          className="main__bg rules"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    page: state.PagesReducers.page,
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps, null)(Page);
