import React, {useState, useEffect, useContext, useRef} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);


function EngineComponent1(props) {
	return (
		<div className={`engine-component-1`}>
			engine-component-1
		</div>
	);
}

function EngineComponent2(props) {
	return (
		<div className={`engine-component-2`}>
			engine-component-2
		</div>
	);
}

function EngineComponent3(props) {
	return (
		<div className={`engine-component-2`}>
			engine-component-3
		</div>
	);
}

function UIElementContainer(props) {
	return null;
}

function UIElement(props) {
	const engineContext = useContext(EngineContext);
	const uiElementRef = useRef(null);
	const [components, setComponents] = useState([]);
	const [engineComponent, setEngineComponent] = useState(props.engineComponents[0]);
	const directions = ["column", "row"];
	const [direction, setDirection] = useState(directions[0]);
	const [selfFlex, setSelfFlex] = useState(1);
	const [percentage, setPercentage] = useState(1);


	useEffect(() => {
		console.debug(`useEffect`, {components, engineComponent, engineComponents: props.engineComponents});
	}, []);


	useEffect(() => {
		console.debug(`useEffect - flex - updateSelfFlex`, {selfFlex});
	});


	const onAdd = () => {
		let newComponents = components.concat([{id: components.length + 1}]);
		console.debug(`onAdd`, {components, newComponents});
		setComponents(newComponents);
	};
	const onRemoveChildren = () => {
		console.debug(`onRemoveChildren`, {components});
		setComponents([]);
	};
	const onEngineComponentChange = (e) => {
		e.persist();
		let newEngineComponent = props.engineComponents.filter(ec => ec.name === e.target.value)[0];
		console.debug(`onEngineComponentChange`, {e, newEngineComponent, props});
		setEngineComponent(newEngineComponent);
	};

	const onDirectionChange = (e) => {
		e.persist();
		console.debug(`onDirectionChange`, {e, props});
		setDirection(e.target.value);
	};

	const adaptFlex = (e) => {
		e.persist();
		console.debug(`adaptFlex`, {e, value: e.target.value});

		let siblingNodes = getSiblingNodes();

		let flexArray = Array.from(siblingNodes).map(node => parseFloat(node.style.flex.split(" ")[0]));
		let flexSum = flexArray.reduce((p, c) => p + c, 0);
		console.debug(`onFlexChange`, {flexArray, flexSum, percentage});

		let flex = (flexSum/100)*percentage;
		setSelfFlex(flex);
	};

	const onPercentageChange = (e) => {
		e.persist();
		console.debug(`onPercentageChange`, {e, value: e.target.value});
		setPercentage(parseFloat(e.target.value));
	};

	const onChildRemoved = (index) => {
		let newComponents = components.filter((component, componentIndex) => {
			if (index !== componentIndex) {
				return component;
			}
		});
		console.debug(`onChildRemoved`, {components, newComponents});
		setComponents(newComponents);
	};

	const getComponents = () => {
		let subComponents = [];
		components.forEach((component, componentIndex) => {
			subComponents.push(
				<UIElement
					key={`${componentIndex}`}
					id={props.id}
					engineComponents={props.engineComponents}
					onChildRemoved={onChildRemoved}
					componentIndex={componentIndex}
					isRoot={false}
				/>
			)
		});
		return (
			<div
				style={{display: "flex", flex: selfFlex, flexDirection: direction}}
			>
				{subComponents}
			</div>
		);
	};

	const getUIElementControls = () => {
		let key = 0;
		let controls = [
			(
				<div className={"control"} key={++key}>
					<select
						onChange={(e) => {
							onEngineComponentChange(e)
						}}
						value={engineComponent.name}
					>
						{
							props.engineComponents.map((engineComponentElement, optionIndex) => {
								return (
									<option
										key={optionIndex}
										value={engineComponentElement.name}
									>
										{engineComponentElement.name}
									</option>
								)
							})
						}
					</select>
				</div>
			),
			(
				<div className={"control"} key={++key}>
					<select
						onChange={(e) => {
							onDirectionChange(e)
						}}
						value={direction}
					>
						{
							directions.map((direction, directionIndex) => {
								return (
									<option
										key={directionIndex}
										value={direction}
									>
										{direction}
									</option>
								)
							})
						}
					</select>
				</div>
			),
			(
				<div className={"control"} key={++key}>
					<input
						type={"number"}
						onChange={(e) => {

						}}
						value={selfFlex}
					/>
				</div>
			),
			(
				<div className={"control"} key={++key}>
					<input
						type={"number"}
						onChange={(e) => {
							onPercentageChange(e)
						}}
						value={percentage}
					/>
				</div>
			),
			(
				<div className={"control"} key={++key}>
					<button onClick={(e) => {
						adaptFlex(e);
					}}>
						set %
					</button>
				</div>
			),
			(
				<div className={"control"} key={++key}>
					<button onClick={() => {
						onAdd()
					}}>
						add child ui element
					</button>
				</div>
			)
		];
		if (components.length > 0) {
			controls.push(
				<div className={"control"} key={++key}>
					<button onClick={() => {
						onRemoveChildren()
					}}
					>
						remove children
					</button>
				</div>
			)
		}
		if (props.isRoot !== true) {
			controls.push(
				<div className={"control"} key={++key}>
					<button onClick={() => {
						props.onChildRemoved(props.componentIndex)
					}}>
						remove self
					</button>
				</div>
			)
		}
		return controls;
	};

	const getSiblingNodes = () => {
		console.debug(`getSiblingUIElements`, {uiElementRef});
		if(uiElementRef && uiElementRef.current){
			let parentNode =  uiElementRef.current.parentNode;
			let siblingNodes = parentNode.children;
			return siblingNodes;
		}
		return [];
	};
	const getParentNode = () => {
		console.debug(`getParentNode`, {uiElementRef});
		if(uiElementRef && uiElementRef.current){
			let parentNode =  uiElementRef.current.parentNode;
			return parentNode;
		}
		return null;
	};

	const onHandleDrag = (e) => {
		e.persist();
		let dragX = e.pageX;
		let dragY = e.pageY;
		console.debug(`onHandleDrag`, {dragX, dragY, e});
	};

	return (
		<div className={`ui-element`} style={{flex: selfFlex}} ref={uiElementRef}>
			<div className={"controls"}>
				{getUIElementControls()}
			</div>
			{engineComponent.hook()}
			{getComponents()}
			<div className={"controls"}>
				<div
					className={"resize-handle"}
					onDragStart={onHandleDrag}
					onDrag={onHandleDrag}
					onDragEnd={onHandleDrag}
				>
					handle
				</div>
			</div>
		</div>
	);
}

function Version(props) {

	const engineContext = useContext(EngineContext);

	useEffect(() => {

	}, []);

	return (
		<div className="version">
			{engineContext.version}
		</div>
	);
}

function Engine() {
	useEffect(() => {

	}, []);

	return (
		<EngineContext.Provider value={defaultEngineContext}>
			{/*<div className="engine">
				engine
			</div>
			<Version/>*/}
			<UIElement
				id={1}
				engineComponents={[{name: "UIElementContainer", hook: UIElementContainer}, {name: "EngineComponent1", hook: EngineComponent1}, {name: "EngineComponent2", hook: EngineComponent2}, {name: "EngineComponent3", hook: EngineComponent3},]}
				onChildRemoved={() => {}}
				componentIndex={0}
				isRoot={true}
			/>
		</EngineContext.Provider>
	);
}

export default Engine;
