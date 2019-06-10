import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Split from "split.js";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Menu(props) {
	const [isOpen, setIsOpen] = useState(false);
	const onChildrenRemove = () => {
		let masterTree = {...props.masterTree};

		let walkTree = (subComponentTree) => {
			if (subComponentTree.id === props.subComponentTree.id) {
				subComponentTree.children = []
			} else {
				Object.keys(subComponentTree).forEach((key) => {
					if (key === "children") {
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
	const onChildAdd = () => {
		let masterTree = {...props.masterTree};

		let walkTree = (subComponentTree) => {
			if (subComponentTree.id === props.subComponentTree.id) {
				subComponentTree.children.push({
					id: `${subComponentTree.id}-${subComponentTree.children.length}`,
					data: `${subComponentTree.id}-${subComponentTree.children.length}`,
					children: []
				})
			} else {
				Object.keys(subComponentTree).forEach((key) => {
					if (key === "children") {
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
					<button onClick={onChildAdd}>add child</button>
					<button onClick={onChildrenRemove}>remove children</button>
					<button onClick={props.flipDirection}>change to {props.getOppositeDirection()}</button>
				</div>
			)
		} else {
			return null;
		}
	};
	return (
		<div className={"menu"}>
			<button onClick={() => {
				setIsOpen(!isOpen)
			}}>
				menu
			</button>
			{getMenuItems()}
		</div>
	);
}


function Component(props) {
	const directions = {row: "row", column: "column"};
	const splitPrefix = "component-split";
	const [direction, setDirection] = useState(directions.row);

	const getFlexDirection = () => {
		if (direction === directions.row) {
			return "row";
		} else if (direction === directions.column) {
			return "column";
		}
	};

	useEffect(() => {
		console.debug(`useEffect - split.js setup`);
		// determine the css ids of the direct children
		let subComponentTree = props.subComponentTree;
		let idArray = subComponentTree.children.map((subComponent, i) => `#${splitPrefix}-${subComponent.id}`);
		console.debug(`useEffect - split.js setup`, {idArray, subComponentTree});
		let splitInstance = null;
		if (idArray.length > 0) {
			splitInstance = Split(idArray, {
				direction: getGutterDirection(),
				elementStyle: (dimension, size, gutterSize) => ({
					'flex-basis': `calc(${size}% - ${gutterSize}px)`,
				}),
				gutterStyle: (dimension, gutterSize) => ({
					'flex-basis': `${gutterSize}px`,
				}),
			})
		}
		return () => {
			// cleanup
			console.debug(`useEffect - split.js cleanup`, {idArray, subComponentTree, splitInstance});
			if(splitInstance !== null){
				splitInstance.destroy();
			}
		}
	}, [props, direction]);

	const flipDirection = () => {
		if (direction === directions.row) {
			setDirection(directions.column);
		} else {
			setDirection(directions.row);
		}
	};
	const getOppositeDirection = () => {
		if (direction === directions.row) {
			return directions.column;
		} else if (direction === directions.column) {
			return directions.row;
		}
	};
	const getGutterDirection = () => {
		if (direction === directions.row) {
			return "horizontal";
		} else if (direction === directions.column) {
			return "vertical";
		}
	};
	const getSubCompnents = () => {
		let subComponentTree = props.subComponentTree;
		let subComponents = [];

		Object.keys(subComponentTree).forEach((key) => {
			if (key === "children") {
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
		<div
			id={`component-split-${props.subComponentTree.id}`}
			className={`component ${props.subComponentTree.id}`}
			style={{
				flexDirection: getFlexDirection()
			}}>
			<Menu {...props} flipDirection={flipDirection} getOppositeDirection={getOppositeDirection}/>
			{getSubCompnents()}
			{props.subComponentTree.id}
		</div>
	)
}

function Engine() {
	const [masterTree, setMasterTree] = useState(null);

	useEffect(() => {
		let defaultTree = {
			id: "0",
			data: "component-0",
			children: [
				{
					id: "0-0",
					data: "component-0-0",
					children: []
				},
				{
					id: "0-1",
					data: "component-0-1",
					children: [
						{
							id: "0-1-0",
							data: "component-0-1-0",
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

	if (masterTree !== null) {
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
