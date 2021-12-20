import React from "react";
import { Route, Redirect } from "react-router-dom";
import { widget, app } from "components";

type PrivateRouteProps = { loginPath: string, path: any, component: any }
type PrivateRouteState = { tryAutoSignin: boolean }

const session = app.host.session;
export class PrivateRoute extends React.Component<PrivateRouteProps, PrivateRouteState> {
  state = { tryAutoSignin: false }

  tryAutoSigninRender() {
    let successCallback = (_accountACL: any) => {
      this.forceUpdate();
    };
    let failCallback = () => {
      this.setState({ tryAutoSignin: true })
    };
    session.autoSignin(successCallback, failCallback);
    return (
      <div className='mx-auto' style={{ marginTop: 100, fontWeight: 'bold', fontSize: '3rem' }}>
        Loading....
      </div>
    );
  }

  render() {
    if (session.authenticated) {
      let { component: Component, ...rest } = this.props;
      let render = (props: any) => {
        return (<Component {...props} />);
      };
      return (<Route {...rest} render={render} />);
    }

    let { tryAutoSignin } = this.state;
    if (!tryAutoSignin) {
      return this.tryAutoSigninRender();
    }

    let { loginPath } = this.props;
    let { component: Component, ...rest } = this.props;
    let render = (props: any) => {
      if (session.authenticated) return (<Component {...props} />);
      else return (<Redirect to={{ pathname: loginPath, state: { from: props.location } }} />);
    };
    return (<Route {...rest} render={render} />);
  }
}

type UILoginProps = { location?: any }
type UILoginState = { redirectToReferrer: any }
export class UILogin extends React.Component<UILoginProps, UILoginState> {
  state = { redirectToReferrer: false };

  onLogin(loginModel: any) {
    let loginIdInput =  document.getElementById('loginId');
    loginIdInput?.focus();
    let passwordInput =  document.getElementById('password');
    passwordInput?.focus();
    loginIdInput?.focus();

    let successCallback = (_accountACL: any) => {
      this.setState({ redirectToReferrer: true });
    };
    session.signin(loginModel, successCallback);
  };

  onLoginByShortcutKey(winput: widget.input.WInput, _evt: any, keyCode: number, currInput: any, model: any) {
    if (keyCode && keyCode === 13) {
      winput.updateValue(currInput);
      this.onLogin(model);
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/admin" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    let model = { loginId: '', password: '', validFor: 7 };

    const { FormContainer, ColFormGroup, Row } = widget.input;
    const { BBStringField, BBRadioInputField, BBPasswordField } = widget.input;
    const { FAButton, FAIcon, fas } = widget.fa;
    let validForOpts = [1, 7, 30];
    let validForOptLabels = ['1 Day', '7 Days', '30 Days'];
    let html = (
      <div style={{ height: '100%' }}>
        <div className='ui-login mx-auto' style={{ marginTop: 100, width: 500 }}>
          <div className="ui-card">
            <div className="header">
              <h4>Login</h4>
              <FAIcon size='2x' icon={fas.faSignOutAlt} />
            </div>

            <FormContainer fluid className='py-2 px-5'>
              <Row>
                <ColFormGroup span={12} className='mt-2 mb-1'>
                  <label>Username</label>
                  <BBStringField
                    inputId={'loginId'} bean={model} field={'loginId'} required
                    onKeyDown={(winput: widget.input.WInput, e: any, keyCode: number, currInput: any) => this.onLoginByShortcutKey(winput, e, keyCode, currInput, model)} />
                </ColFormGroup>
              </Row>

              <Row>
                <ColFormGroup span={12} className='mt-2 mb-1'>
                  <label>Password</label>
                  <BBPasswordField inputId={'password'} bean={model} field={'password'} required
                    onKeyDown={
                      (winput: widget.input.WInput, e: any, keyCode: number, currInput: any) => {
                        this.onLoginByShortcutKey(winput, e, keyCode, currInput, model);
                      }
                    }
                  />
                </ColFormGroup>
              </Row>

              <Row>
                <ColFormGroup span={12} className='mt-2 mb-1 flex-hbox-grow-0 justify-content-between'>
                  <div className='flex-hbox-grow-0'>
                    <label className='text-nowrap mr-2'>Valid For:</label>
                    <BBRadioInputField
                      bean={model} field={'validFor'} options={validForOpts} optionLabels={validForOptLabels} />
                  </div>
                  {/* <Link to=''>Forgot Password</Link> */}
                </ColFormGroup>
              </Row>
            </FormContainer>

            <div className='footer'>
              <FAButton size='md' color='primary' icon={fas.faSignInAlt} onClick={() => this.onLogin(model)}>Submit</FAButton>
            </div>
          </div>
        </div>

      </div>
    );
    return html;
  }
}