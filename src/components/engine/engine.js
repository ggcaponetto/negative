import React, {useState, useEffect, useContext} from 'react';
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
	return (
		<div className={`ui-element-container`}>
			ui-element-container
		</div>
	);
}

function UIElement(props) {
	const engineContext = useContext(EngineContext);
	const [components, setComponents] = useState([]);
	const [engineComponent, setEngineComponent] = useState(props.engineComponents[0]);
	const directions = ["column", "row"];
	const [direction, setDirection] = useState(directions[0]);

	useEffect(() => {
		console.debug(`useEffect`, {components, engineComponent, engineComponents: props.engineComponents});
	}, []);


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
				<div className={`subcomponent direction-${direction}`} key={componentIndex}>
					<UIElement
						key={`ui-component-fragment-${component.id}`}
						id={`${props.id}-${component.id}`}
						engineComponents={props.engineComponents}
						onChildRemoved={onChildRemoved}
						componentIndex={componentIndex}
					/>
				</div>

			)
		});
		if(subComponents.length > 0){
			return (
				<div className={`subcomponents direction-${direction}`}>
					{subComponents}
				</div>
			)
		} else {
			return null;
		}
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
		if (props.onChildRemoved !== null) {
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

	const displayComponent = () => {
		console.debug(`displayComponent`, {engineComponent});
		if(engineComponent.name !== "UIElementContainer"){
			return (
				<div className={"component subcomponent engine-component"}>
					{engineComponent.hook()}
				</div>
			);
		} else {
			return null;
		}
	};

	return (
		<div className={`ui-element`}>
			<div className={"controls"}>
				{getUIElementControls()}
			</div>
			{displayComponent()}
			{getComponents()}
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
				onChildRemoved={null}
				componentIndex={0}
			/>
		</EngineContext.Provider>
	);
}

export default Engine;
