import React from 'react';
import './App.css';
import { create } from 'ipfs-http-client';
import logo from './images/logo.png';
const client = create('https://ipfs.infura.io:5001/api/v0');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileURL: "",
      error: "",
    };
  }

  async onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      this.setState({ fileURL:url, error:"" });
      console.log(url);
    } catch (error) {
      this.setState({ error:error, fileURL:"" });
      console.log('Error uploading file: ', error);
    }  
  }

  uploadAgain() {
    this.setState({ fileURL:"", error:"" });
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
                            <input type="file" className="form-control form-control-lg" accept="image/png, image/gif, image/jpeg" onChange={(e) => this.onChange(e)} />
                            <br/>
                            <div className="alert alert-info">
                              {/*<strong>File uploaded successfully!</strong><br/>*/}
                              Upload an image and it will be automatically uploaded to IPFS.
                            </div>
                          </div>
                        }
                        { (this.state.fileURL !== "") &&
                          <div>
                            <div className="alert alert-success">
                              <strong>File uploaded successfully!</strong><br/>
                              Here's your uploaded image: <a href={this.state.fileURL} target="_blank" rel="noreferrer">{ this.state.fileURL }</a>
                            </div>
                            <img src={this.state.fileURL} className="img-thumbnail" alt={this.state.fileURL.replace("https://ipfs.infura.io/ipfs/", "")} />
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
