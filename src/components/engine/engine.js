import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Component(props) {
	const [componentStyle, setCompoenntStyle] = useState({
		position: "relative",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});

	function Menu() {
		const [isOpen, setIsOpen] = useState(false);
		const onClick = (e) => {
			let masterTree = props.masterTree;

			let walkTree = (subComponentTree) => {
				if(subComponentTree.id === props.subComponentTree.id){
					alert(subComponentTree.id)
				} else {
					Object.keys(subComponentTree).forEach((key) => {
						if(key === "children"){
							subComponentTree[key].forEach((subComponentTree) => {
								walkTree(subComponentTree)
							});
						}
					});
				}
			};
			walkTree(masterTree);

			props.setMasterTree(masterTree);
		};
		const getMenuItems = () => {
			if (isOpen) {
				return (
					<div className={"menu-items"}>
						<button onClick={onClick}>add child</button>
					</div>
				)
			}
		};
		return (
			<div>
				<div className={"menu"}>
					<button onClick={() => {
						setIsOpen(!isOpen)
					}}>
						menu
					</button>
					{getMenuItems()}
				</div>
			</div>
		);
	}

	const getSubCompnents = () => {
		let subComponentTree = props.subComponentTree;
		let subComponents = [];

		Object.keys(subComponentTree).forEach((key) => {
			if(key === "children"){
				subComponentTree[key].forEach((subComponentTree, i) => {
					subComponents.push((
						<Component
							key={i}
							masterTree={props.masterTree}
							subComponentTree={subComponentTree}
							setMasterTree={props.setMasterTree}
						/>
					))
				});
			}
		});
		return subComponents;
	};

	return (
		<div style={componentStyle}>
			<Menu/>
			{getSubCompnents()}
			{props.subComponentTree.id}, {props.subComponentTree.data}
		</div>
	)
}

function Engine() {
	const [masterTree, setMasterTree] = useState({
		id: "1",
		data: "component-1",
		children: [
			{
				id: "1-1",
				data: "component-2",
				children: []
			},
			{
				id: "1-2",
				data: "component-3",
				children: [
					{
						id: "1-2-1",
						data: "component-4",
						children: []
					},
				]
			},
		]
	});

	useEffect(() => {

	}, []);

	const updateMasterTree = (newTree) => {
		console.debug(`updateMasterTree`, {newTree});
		setMasterTree(newTree);
	};

	const getEngine = () => {
		return (
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}}>
				<Component
					masterTree={masterTree}
					subComponentTree={masterTree}
					setMasterTree={(newTree) => {
						updateMasterTree(newTree);
					}}
				/>
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
