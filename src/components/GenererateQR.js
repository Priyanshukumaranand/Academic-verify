import React, { Component, createRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

import "./Modals.css";
import { Button, Header, Modal } from "semantic-ui-react";

export default class GenererateQR extends Component {
  state = {
    qr: "",
    account: "",
  };

  qrRef = createRef();

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] }, this.generateQrDataUrl);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.account !== this.state.account) {
      this.generateQrDataUrl();
    }
  };

  generateQrDataUrl = () => {
    const canvas = this.qrRef.current;
    if (canvas && typeof canvas.toDataURL === "function") {
      this.setState({ qr: canvas.toDataURL() });
    }
  };

  render() {
    return (
      <Modal size="tiny" className="modal-des" open={this.props.isOpen}>
        <Header
          className="modal-heading"
          icon="qrcode"
          content="Scan or Download"
          as="h2"
        />
        <Modal.Content className="modal-content pos-middle-qr">
          {this.state.account && (
            <a href={this.state.qr} download>
              <QRCodeCanvas
                value={this.state.account}
                size={220}
                includeMargin
                ref={this.qrRef}
              />
            </a>
          )}
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => this.props.closeQRModal()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}