import React from "react";
// import ReactDOM from 'react-dom';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { render } from "./mreact/react-dom";

import Component from './mreact/Component';

class ClassComponent extends Component {
  render() {
    return (
      <div className="class-comp">
        类组件-{this.props.name}
      </div> 
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="fun-comp">
      函数组件
    </div>
  )
}

const jsx = (
  <div className="border">
    <h1>全栈</h1>
    <a href="https://www.baidu.com">百度</a>
    <FunctionComponent />
    <ClassComponent name="class comp" />
  </div>
);

console.log("jsx", jsx);

render(
  jsx,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// console.log(React.version); // 17.0.2
