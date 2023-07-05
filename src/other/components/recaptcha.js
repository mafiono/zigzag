import React from "react";
import { ReCaptcha } from "react-recaptcha-google";

class RecaptchaBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errors: false,
    };
  }
  static getDerivedStateFromError(error) {
    return { errors: error };
  }
  componentDidCatch(error, errorInfo) {
    return this.setState({ errors: { error, errorInfo } });
  }
  render() {
    const { errors } = this.state;

    if (!errors) {
      return <ReCaptchaTemplate {...this.props} />;
    }

    return null;
  }
}

const ReCaptchaTemplate = React.memo((props) => {
  if (!window.grecaptcha?.render) {
    return null;
  }
  return (
    <ReCaptcha
      ref={props.captcha}
      size="invisible"
      render="explicit"
      sitekey="6LdAz94UAAAAAKY3cRPGWmxEpaWMdj8VtDYprl2c"
      onloadCallback={props.resetCaptcha}
      verifyCallback={props.verifyCallback}
    />
  );
});

export default RecaptchaBoundary;
