import React from "react";
import { Component } from "react";

import {
  Button, ButtonGroup,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Navbar, NavbarBrand, Nav, NavItem, NavLink,
  DropdownToggle,
  DropdownMenu, DropdownItem,
  Popover, PopoverHeader, PopoverBody,
  UncontrolledDropdown
} from 'reactstrap';

class NavbarDemo extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { isOpen: false };
  }

  toggle() {
    console.log('call toggle');
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    console.log('open state = ' + this.state.isOpen);
    return (
      <div>
        <Navbar color="primary" dark expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>

          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Options</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

class ButtonGroupDemo extends Component {
  render() {
    return (
      <div>
        <ButtonGroup size='sm'>
          <Button>Left</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <br /> <br />
        <ButtonGroup>
          <Button>Left</Button>
          <Button>Middle</Button>
          <Button>Middle</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <br /> <br />
        <ButtonGroup size='lg'>
          <Button>Left</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
      </div>
    );
  }
}

class PopoverDemo extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { popoverOpen: false };
  }

  toggle() {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  }

  render() {
    return (
      <div>
        <Button id="Popover1" onClick={this.toggle}>
          Launch Popover
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>Popover Title</PopoverHeader>
          <PopoverBody>
            Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
            venenatis vestibulum.
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

class NestedModalDemo extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { modal: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle}>Modal</Button>
        <Modal size='sm' isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody size='sm'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor...
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

class ModalDemo extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { modal: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Modal</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
            <PopoverDemo />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            <NestedModalDemo />
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export function UIBootstrapDemo() {
  let html = (
    <div>
      <div>
        <h4>Bootstrap Button Collor</h4>
        <div>
          <Button color="primary" onClick={(_evt: any) => alert('on click')}>primary</Button>{' '}
          <Button color="secondary">secondary</Button>{' '}
          <Button color="success">success</Button>
          <Button color="info">info</Button>
          <Button color="warning">warning</Button>
          <Button color="danger">danger</Button>
          <Button color="link">link</Button>
        </div>
      </div>

      <div>
        <h4>Bootstrap Button Size</h4>
        <div>
          <Button size="lg" color="primary">Sprimary</Button>{' '}
          <Button color="secondary">Ssecondary</Button>{' '}
          <Button size="sm" color="success">Success</Button>
        </div>
      </div>

      <div>
        <h4>Bootstrap ButtonGroup</h4>
        <ButtonGroupDemo />
      </div>

      <div>
        <h4>Bootstrap Navbar</h4>
        <NavbarDemo />
      </div>

      <div>
        <h4>Popup Demo</h4>
        <ModalDemo />
      </div>
    </div>
  );
  return html;
}