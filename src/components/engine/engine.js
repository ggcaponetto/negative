import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Menu(props) {
	const [isOpen, setIsOpen] = useState(false);
	const onClick = (e) => {
		let masterTree = {...props.masterTree};

		let walkTree = (subComponentTree) => {
			if(subComponentTree.id === props.subComponentTree.id){
				subComponentTree.children.push({
					id: `${subComponentTree.id}-${subComponentTree.children.length}`,
					data: `${subComponentTree.id}-${subComponentTree.children.length}`,
					children: []
				})
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

		props.updateMasterTree(masterTree);
	};
	const getMenuItems = () => {
		if (isOpen) {
			return (
				<div className={"menu-items"}>
					<button onClick={onClick}>add child</button>
				</div>
			)
		} else {
			return null;
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


function Component(props) {
	const [componentStyle, setCompoenntStyle] = useState({
		position: "relative",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});

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
							updateMasterTree={props.updateMasterTree}
						/>
					))
				});
			}
		});
		return subComponents;
	};

	return (
		<div style={componentStyle}>
			<Menu {...props}/>
			{getSubCompnents()}
			{props.subComponentTree.id}, {props.subComponentTree.data}
		</div>
	)
}

function Engine() {
	const [masterTree, setMasterTree] = useState(null);

	useEffect(() => {
		let defaultTree = {
			id: "1",
			data: "component-1",
			children: [
				{
					id: "1-1",
					data: "component-1-1",
					children: []
				},
				{
					id: "1-2",
					data: "component-1-2",
					children: [
						{
							id: "1-2-1",
							data: "component-1-2-1",
							children: []
						},
					]
				},
			]
		};
		console.debug(`useEffect`, {defaultTree, masterTree});
		setMasterTree(defaultTree);
	}, []);
	useEffect(() => {
		console.debug(`useEffect`, {masterTree});
	}, [masterTree]);

	if(masterTree !== null){
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
					updateMasterTree={(newTree) => {
						console.debug(`updateMasterTree`, {newTree, masterTree});
						setMasterTree(newTree);
					}}
				/>
			</div>
		);
	} else {
		return (
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}}/>
		);
	}
}

export default Engine;
