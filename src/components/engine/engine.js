import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Component() {
	const [componentStyle, setCompoenntStyle] = useState({
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});
	const [subComponents, setSubComponents] = useState([]);

	function Menu() {
		const [isOpen, setIsOpen] = useState(false);
		const getMenuItems = () => {
			if (isOpen) {
				return (
					<div>
						<div>item1</div>
						<div>item2</div>
						<div>item3</div>
						<div>item4</div>
					</div>
				)
			}
		};
		return (
			<div>
				<div className={"component-menu"}>
					<button onClick={() => {
						setIsOpen(!isOpen)
					}}>
						component-menu
					</button>
					{getMenuItems()}
				</div>
				<div className={"component-body"}>
					component-body
				</div>
			</div>
		);
	}

	return (
		<div style={componentStyle}>
			<Menu/>
		</div>
	)
}

function Engine() {
	const [componentTree, setComponentTree] = useState({
		id: 1,
		data: null,
		parent: null,
		children: [
			{
				id: 2,
				data: null,
				parent: 1,
				children: []
			},
			{
				id: 3,
				data: null,
				parent: 1,
				children: []
			},
		]
	});

	useEffect(() => {

	}, []);

	const getEngine = () => {
		return (
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}}>
				<Component componentTree={componentTree}/>
			</div>
		);
	};
	return (
		<EngineContext.Provider value={defaultEngineContext}>
			<Router>
				<Route
					path="/"
					render={(props) => {
						console.debug(`props`, props);
						return getEngine();
					}}
				/>
				<Route
					path="/component/:id"
					render={(props) => {
						let tabId = props.match.params.id;
						console.debug(`props`, {tabId, props});
						return null;
					}}
				/>
			</Router>
		</EngineContext.Provider>
	);
}

export default Engine;
