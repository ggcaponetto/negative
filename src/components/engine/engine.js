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
	const onSelfRemove = () => {
		let masterTree = {...props.masterTree};

		let walkTree = (subComponentTree) => {

			let target = subComponentTree.children.filter((subComponentNode) => {
				return subComponentNode.id === props.subComponentTree.id
			})[0];

			if(target){
				subComponentTree.children = subComponentTree.children.filter((subComponentNode) => {
					return subComponentNode.id !== props.subComponentTree.id
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
	const onComponentSelect = (e) => {
		e.persist();
		console.debug(`onComponentSelect`, {e});
		let value = e.target.value;
		props.setDisplayedComponentId(value);
	};
	const onDirectionFlip = () => {
		props.flipDirection();
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
	const getSelect = () => {
		if(props.subComponentTree.children.length === 0){
			return (
				<select onChange={onComponentSelect}>
					{props.componentIdArray.map((componentId, i) => <option key={i} value={componentId}>{componentId}</option>)}
				</select>
			)
		}
	};
	const getMenuItems = () => {
		if (isOpen) {
			return (
				<div className={"menu-items"}>
					<button onClick={onChildAdd}>add child</button>
					<button onClick={onSelfRemove}>remove self</button>
					<button onClick={onChildrenRemove}>remove children</button>
					<button onClick={onDirectionFlip}>change to {props.getOppositeDirection()}</button>
					{getSelect()}
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
	const [direction, setDirection] = useState(directions.column);
	const [displayedComponentId, setDisplayedComponentId] = useState(null);

	const getFlexDirection = () => {
		if (direction === directions.row) {
			return "row";
		} else if (direction === directions.column) {
			return "column";
		}
	};

	useEffect(() => {
		console.debug(`useEffect - component setup`);
		// determine the css ids of the direct children
		let subComponentTree = props.subComponentTree;
		let idArray = subComponentTree.children.map((subComponent, i) => `#${splitPrefix}-${subComponent.id}`);
		setDisplayedComponentId("container");
	}, []);
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
					'flex-basis': `${5}px`,
					/*'height': `${gutterSize}px`,*/
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

							componentIdArray={props.componentIdArray}
							isUiComposerOpen={props.isUiComposerOpen}
						/>
					))
				});
			}
		});
		if(subComponents.length > 0){
			return (
				<div
					className={`subcomponents`}
					style={{
						flexDirection: getFlexDirection()
					}}
				>
					{subComponents}
				</div>
			);
		}
	};
	const getComponent = () => {
		if(displayedComponentId === "container"){
			return null;
		} else {
			return <div className={"selfcomponent"}>{props.subComponentTree.id}, {displayedComponentId}</div>
		}
	};
	const getMenu = () => {
		if(props.isUiComposerOpen){
			return (
				<Menu
					{...props}
					flipDirection={flipDirection}
					getOppositeDirection={getOppositeDirection}
					setDisplayedComponentId={(componentId) => {
						setDisplayedComponentId(componentId)
					}}
				/>
			);
		} else {
			return null;
		}
	};

	return (
		<div
			id={`component-split-${props.subComponentTree.id}`}
			className={`component ${props.subComponentTree.id}`}
			style={{
				flexDirection: "column"
			}}
		>
			{getMenu()}
			{getSubCompnents()}
			{getComponent()}
		</div>
	)
}

function Engine() {
	const [masterTree, setMasterTree] = useState(null);
	const [isUiComposerOpen, setIsUiComposerOpen] = useState(null);
	const isUiComposerOpenRef = useRef(false);
	const [componentIdArray, setComponentIdArray] = useState([
		"container", "threejs", "console", "filetree"
	]);

	useEffect(() => {
		console.debug(`useEffect - ui composer`, {isUiComposerOpenRef});
		let keydownListener = document.addEventListener('keydown', (event) => {
			const keyName = event.key;
			if (keyName === 'Control') {
				// not alert when only Control key is pressed.
				return;
			}
			if (event.ctrlKey) {
				// Even though event.key is not 'Control' (i.e. 'a' is pressed),
				// event.ctrlKey may be true if Ctrl key is pressed at the time.
				if(keyName === "q"){
					console.debug(`combination of ctrl + ${keyName} pressed.`, {isUiComposerOpenRef});
					isUiComposerOpenRef.current = !isUiComposerOpenRef.current;
					setIsUiComposerOpen(isUiComposerOpenRef.current);
				}
			}
		}, false);
		return () => {
			// cleanup
			window.removeEventListener("keydown", keydownListener);
		}
	}, []);

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
	}, [masterTree, isUiComposerOpenRef.current]);

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

					componentIdArray={componentIdArray}
					isUiComposerOpen={isUiComposerOpen}
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
