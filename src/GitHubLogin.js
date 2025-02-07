import React, { Component } from "react";
import { func, node, string } from "prop-types";

import PopupWindow from "./PopupWindow";
import { toQuery } from "./utils";

class GitHubLogin extends Component {
  static propTypes = {
    buttonText: string,
    children: node,
    className: string,
    clientId: string.isRequired,
    onRequest: func,
    onSuccess: func,
    onFailure: func,
    redirectUri: string,
    scope: string
  };

  static defaultProps = {
    buttonText: "Sign in with GitHub",
    redirectUri: "",
    scope: "user:email",
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {}
  };

  onBtnClick = () => {
    const { clientId, scope, redirectUri } = this.props;
    const search = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri
    });
    const popup = (this.popup = PopupWindow.open(
      "github-oauth-authorize",
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 1000, width: 600 }
    ));

    this.onRequest();
    popup.then(data => this.onSuccess(data), error => this.onFailure(error));
  };

  onRequest = () => this.props.onRequest();

  onSuccess = data => {
    if (!data.code) {
      return this.onFailure(new Error("'code' not found"));
    }

    this.props.onSuccess(data);
  };

  onFailure = error => this.props.onFailure(error);

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    return <button {...attrs}>{children || buttonText}</button>;
  }
}

export default GitHubLogin;
