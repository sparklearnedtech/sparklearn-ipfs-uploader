import React from 'react';
import './App.css';
import { create } from 'ipfs-http-client';
import logo from './images/logo.png';
import { Buffer } from "buffer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileURL: "",
      passcode: "",
      error: "",
    };
  }

  async onChange(e) {
    const file = e.target.files[0];
    if (this.state.passcode !== process.env.REACT_APP_Password) {
      this.setState({ error: "Wrong passcode.", fileURL:"", passcode:"" });
    } else if (file.size > 10e5) {
      this.setState({ error: "Please upload a file smaller than 1 MB", fileURL:"", passcode:"" });
    } else {
      try {
        const auth = "Basic " + Buffer.from(`${process.env.REACT_APP_ProjectId}:${process.env.REACT_APP_ProjectSecret}`).toString("base64");
        const client = create({
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: auth,
          },
        });
        const added = await client.add(file);
        //console.log(added);
        const url = `https://ipfs.io/ipfs/${added.path}`
        this.setState({ fileURL:url, passcode:"", error:"" });
        //console.log(url);
      } catch (error) {
        this.setState({ error:error, fileURL:"", passcode:"" });
        //console.log('Error uploading file: ', error);
      }
    }
  }

  uploadAgain() {
    this.setState({ fileURL:"", error:"" });
  }

  handleInput(state, event) {
    this.setState({ [state]: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="align-items-center justify-content-center">
            <br/>
            <div className="card">
              <div className="card-header text-center">
                <img alt="logo" className="align-self-center" src={logo} height="69" width="80" />
                <h3>SparkLearn EdTech IPFS Uploader</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="container">
                    <div className="row">
                      <div className={ ((this.state.fileURL === "" && this.state.error === "") && "form-group" ) + " col-12" }>
                        { (this.state.fileURL === "" && this.state.error === "") &&
                          <div>
                            <div className="row">
                              <div className="col-6">
                                <input type="name" className="form-control form-control-lg" value={this.state.passcode} onChange={(e) => this.handleInput("passcode", e)} placeholder="Passcode" />
                              </div>
                              <div className="col-6">
                                <input type="file" className="form-control form-control-lg" accept="image/png, image/gif, image/jpeg" onChange={(e) => this.onChange(e)} />
                              </div>
                            </div>
                            <br/>
                            <div className="alert alert-info">
                              Upload an image and it will be automatically uploaded to IPFS.
                            </div>
                            <div className="alert alert-warning">
                              Due to limited amount of storage, we only allow 1 MB file size and limit the access of this uploader to <a href="https://lrn.ac/bdb" target="_blank" rel="noreferrer">BDB 2022</a> students. As for the passcode, mentor <code>harvz</code> will provide it on <code>🔒bdb2022</code> Slack channel.
                            </div>
                          </div>
                        }
                        { (this.state.fileURL !== "") &&
                          <div>
                            <div className="alert alert-success">
                              <strong>File uploaded successfully!</strong><br/>
                              Here's your uploaded image: <a href={this.state.fileURL} target="_blank" rel="noreferrer">{ this.state.fileURL }</a>
                            </div>
                            <img src={this.state.fileURL} className="img-thumbnail" alt={this.state.fileURL.replace("https://ipfs.io/ipfs/", "")} />
                            <br/><br/>
                          </div>
                        }
                        { (this.state.error !== "") &&
                          <div className="alert alert-danger">
                            <strong>Error uploading file</strong><br/>
                            { this.state.error }
                          </div>
                        }
                        { (this.state.fileURL !== "" || this.state.error !== "") &&
                          <button className="btn btn-primary" onClick={() => this.uploadAgain()}>Upload Again</button>
                        }
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer text-muted text-center">
                <small>© <a href="https://sparklearn-edtech.com/about-us" target="_blank" rel="noreferrer">SparkLearn EdTech Inc.</a></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
