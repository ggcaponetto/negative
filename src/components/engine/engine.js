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

function UIElement(props) {
	const engineContext = useContext(EngineContext);
	const [components, setComponents] = useState([]);
	const [engineComponent, setEngineComponent] = useState(props.engineComponents[0]);

	useEffect(() => {
		console.debug(`useEffect`, {components, engineComponent, engineComponents: props.engineComponents});
	}, []);


	const onAdd = () => {
		let newComponents = components.concat([{id: components.length + 1}]);
		console.debug(`onAdd`, {components, newComponents});
		setComponents(newComponents);
	};
	const onRemove = () => {
		let newComponents = components.concat([]);
		newComponents.pop();
		console.debug(`onRemove`, {components, newComponents});
		setComponents(newComponents);
	};
	const onEngineComponentChange = (e) => {
		e.persist();
		let newEngineComponent = props.engineComponents.filter(ec => ec.name === e.target.value)[0];
		console.debug(`onEngineComponentChange`, {e, newEngineComponent ,props});
		setEngineComponent(newEngineComponent);
	};

	const getComponents = () => {
		let subComponents = [];
		components.forEach((component) => {
			subComponents.push(
				<React.Fragment key={`ui-component-fragment-${component.id}`}>
					<div className="ui-component">
						ui-component-{component.id}
					</div>
					<UIElement id={`${props.id}-${component.id}`} engineComponents={props.engineComponents}/>
				</React.Fragment>
			)
		});
		return subComponents;
	};

	return (
		<div className={`ui-element`}>
			<div className="ui-component">
				ui-component-{props.id}
			</div>
			<button onClick={() => {onAdd()}}>add</button>
			<button onClick={() => {onRemove()}}>remove</button>
			<select
				onChange={(e) => {onEngineComponentChange(e)}}
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
			{engineComponent}
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
			<div className="engine">
				engine
			</div>
			<Version/>
			<UIElement id={1} engineComponents={[EngineComponent1, EngineComponent2]}/>
		</EngineContext.Provider>
	);
}

export default Engine;
