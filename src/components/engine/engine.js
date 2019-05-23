import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

function ResizeBar(props) {
	const resizeBar = useRef(null);
	const [barEvents, setBarEvents] = useState([]);

	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect`);
		let containerHeight = props.uiContainer.current.clientHeight;
		let containerWidth = props.uiContainer.current.clientWidth;
		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarWidth = resizeBar.current.clientWidth;
		let resizeBarTopBorderPosition = containerHeight - resizeBarHeight;
		let resizeBarLeftBorderPosition = containerWidth - resizeBarWidth;
		let cappedResizeBarTopBorderPosition = Math.min(Math.max(resizeBarTopBorderPosition, 0), containerHeight - resizeBarHeight);
		let cappedResizeBarLeftBorderPosition = Math.min(Math.max(resizeBarLeftBorderPosition, 0), containerWidth - resizeBarWidth);
		console.debug(`${ResizeBar.name} initialSetup`, {
			resizeBarTopBorderPosition,
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth,
			containerHeight,
			uiContainer: props.uiContainer
		});

		let resizeBarStyle = null;
		if (props.direction === props.directions.column) {
			let columnStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: containerHeight - resizeBarHeight,
				left: 0,
				right: 0
			};
			resizeBarStyle = columnStyle;
		}
		else if (props.direction === props.directions.row) {
			let rowStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: 0,
				bottom: 0,
				left: containerWidth - resizeBarWidth,
			};
			resizeBarStyle = rowStyle;
		}
		setBarEvents(barEvents.concat([
			{
				cappedResizeBarTopBorderPosition,
				cappedResizeBarLeftBorderPosition,
				resizeBarHeight,
				resizeBarWidth,
				resizeBarStyle
			}
		]));
		return () => {
			console.debug(`${ResizeBar.name} useEffect`);
		}
	}, []);

	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect - direction`);
		let containerHeight = props.uiContainer.current.clientHeight;
		let containerWidth = props.uiContainer.current.clientWidth;
		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarWidth = resizeBar.current.clientWidth;
		let resizeBarTopBorderPosition = containerHeight - resizeBarHeight;
		let resizeBarLeftBorderPosition = containerWidth - resizeBarWidth;
		let cappedResizeBarTopBorderPosition = Math.min(Math.max(resizeBarTopBorderPosition, 0), containerHeight - resizeBarHeight);
		let cappedResizeBarLeftBorderPosition = Math.min(Math.max(resizeBarLeftBorderPosition, 0), containerWidth - resizeBarWidth);
		console.debug(`${ResizeBar.name} initialSetup - direction change`, {
			resizeBarTopBorderPosition,
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth,
			containerHeight,
			uiContainer: props.uiContainer
		});

		let resizeBarStyle = null;
		if (props.direction === props.directions.column) {
			let columnStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: containerHeight - resizeBarHeight,
				left: 0,
				right: 0
			};
			resizeBarStyle = columnStyle;
		}
		else if (props.direction === props.directions.row) {
			let rowStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: 0,
				bottom: 0,
				left: containerWidth - resizeBarWidth,
			};
			resizeBarStyle = rowStyle;
		}
		setBarEvents(barEvents.concat([
			{
				cappedResizeBarTopBorderPosition,
				cappedResizeBarLeftBorderPosition,
				resizeBarHeight,
				resizeBarWidth,
				resizeBarStyle
			}
		]));
		return () => {
			console.debug(`${ResizeBar.name} useEffect`);
		}
	}, [props.direction]);

	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect - barEvents`);
		let lastBarEvent = [].concat(barEvents).pop();
		console.debug(`${ResizeBar.name} useEffect - barEvents`, {lastBarEvent});
		if(lastBarEvent){
			props.onBarEvent(lastBarEvent);
		}
		return () => {
			console.debug(`${ResizeBar.name} useEffect - barEvents`);
		}
	}, [barEvents]);

	const handleDrag = (e) => {
		let isTouch = e.touches;
		let resizeBarTopBorderPosition = e.clientY;
		let resizeBarLeftBorderPosition = e.clientX;
		if (isTouch && e.touches[0]) {
			resizeBarTopBorderPosition = e.touches[0].clientY;
			resizeBarLeftBorderPosition = e.touches[0].clientX;
		} else {
			resizeBarTopBorderPosition = e.clientY;
		}
		let containerHeight = props.uiContainer.current.clientHeight;
		let containerWidth = props.uiContainer.current.clientWidth;
		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarWidth = resizeBar.current.clientWidth;

		// Cap the resizeBarTopBorderPosition.
		// On mouse release the clientY could be negative or higher than te container height
		let cappedResizeBarTopBorderPosition = Math.min(Math.max(resizeBarTopBorderPosition, 0), containerHeight - resizeBarHeight);
		let cappedResizeBarLeftBorderPosition = Math.min(Math.max(resizeBarLeftBorderPosition, 0), containerWidth - resizeBarWidth);

		console.debug(`${ResizeBar.name} handleDrag`, {
			e,
			resizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth,
			containerHeight,
			uiContainer: props.uiContainer
		});

		let resizeBarStyle = null;
		if (props.direction === props.directions.column) {
			let columnStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: cappedResizeBarTopBorderPosition,
				left: 0,
				right: 0
			};
			resizeBarStyle = columnStyle;
		}
		else if (props.direction === props.directions.row) {
			let rowStyle = {
				position: "absolute",
				display: "flex",
				flex: 1,
				cursor: "move",
				background: "grey",
				alignItems: "center",
				justifyContent: "center",
				top: 0,
				bottom: 0,
				left: cappedResizeBarLeftBorderPosition,
			};
			resizeBarStyle = rowStyle;
		}
		setBarEvents(barEvents.concat([
			{
				cappedResizeBarTopBorderPosition,
				cappedResizeBarLeftBorderPosition,
				resizeBarHeight,
				resizeBarWidth,
				resizeBarStyle
			}
		]))
	};

	return (
		<div
			className={ResizeBar.name}
			draggable={true}
			style={props.resizeBarStyle}
			ref={resizeBar}
			onDragStart={(e) => {
				e.persist();
				// e.preventDefault();
				console.debug(`${ResizeBar.name} onDragStart`, e);
				let ghostElement = document.createElement("div");
				ghostElement.style.display = "none"; /* or visibility: hidden, or any of the above */
				e.dataTransfer.setDragImage(ghostElement, 0, 0);
				handleDrag(e);
			}}
			onDrag={(e) => {
				e.persist();
				// e.preventDefault();
				console.debug(`${ResizeBar.name} onDrag`, e);
				handleDrag(e);
			}}
			onDragEnd={(e) => {
				e.persist();
				// e.preventDefault();
				console.debug(`${ResizeBar.name} onDragEnd`, e);
				handleDrag(e);
			}}
			onTouchStart={(e) => {
				e.persist();
				// e.preventDefault();
				console.debug(`${ResizeBar.name} onTouchStart`, e);
				handleDrag(e);
			}}
			onTouchMove={(e) => {
				e.persist();
				// e.preventDefault();
				console.debug(`${ResizeBar.name} onTouchMove`, e);
				handleDrag(e);
			}}
		>
			resizebar ({props.direction})
		</div>
	)
}

function UIContainer() {
	const directions = {column: "column", row: "row"};
	const [barEvents, setBarEvents] = useState([]);
	const [direction, setDirection] = useState(directions.column);
	const uiContainer = useRef(null);

	function getSection1(){
		let lastBarEvent = [].concat(barEvents).pop();
		if (lastBarEvent) {
			if (direction === directions.column) {
				return (
					<div
						className={"section one"}
						style={{
							position: "absolute",
							overflow: "auto",
							top: 0,
							left: 0,
							right: 0,
							bottom: uiContainer.current.clientHeight - lastBarEvent.cappedResizeBarTopBorderPosition,
							background: "aquamarine"
						}}
					>
						{JSON.stringify(lastBarEvent, null, 4)}
						<button
							onClick={() => {
								let newDirection = direction === directions.column ? directions.row : directions.column;
								setDirection(newDirection);
							}}>
							direction swap
						</button>
					</div>
				)
			} else if (direction === directions.row) {
				return (
					<div
						className={"section one"}
						style={{
							position: "absolute",
							overflow: "auto",
							top: 0,
							bottom: 0,
							left: 0,
							right: uiContainer.current.clientWidth - lastBarEvent.cappedResizeBarLeftBorderPosition,
							background: "aquamarine"
						}}
					>
						{JSON.stringify(lastBarEvent, null, 4)}
						<button
							onClick={() => {
								let newDirection = direction === directions.column ? directions.row : directions.column;
								setDirection(newDirection);
							}}>
							direction swap
						</button>
					</div>
				)
			}
		} else {
			console.warn(`${UIContainer.name} getSection1`);
			return null;
		}
	}
	function getSection2(){
		let lastBarEvent = [].concat(barEvents).pop();
		if (lastBarEvent) {
			if (direction === directions.column) {
				return (
					<div className={"section two"} style={{
						position: "absolute",
						overflow: "auto",
						top: lastBarEvent.cappedResizeBarTopBorderPosition + lastBarEvent.resizeBarHeight,
						left: 0,
						right: 0,
						bottom: 0,
						background: "yellow"
					}}>
						{JSON.stringify(lastBarEvent, null, 4)}
					</div>
				)
			} else if (direction === directions.row) {
				return (
					<div className={"section two"} style={{
						position: "absolute",
						overflow: "auto",
						top: 0,
						bottom: 0,
						right: 0,
						left: lastBarEvent.cappedResizeBarLeftBorderPosition + lastBarEvent.resizeBarWidth,
						background: "yellow"
					}}>
						{JSON.stringify(lastBarEvent, null, 4)}
					</div>
				)
			}
		} else {
			console.warn(`${UIContainer.name} getSection1`);
			return null;
		}
	}

	return (
		<div
			className={UIContainer.name}
			style={{
				display: "flex",
				flexDirection: direction,
				flex: 1,
				position: "relative"
			}}
			ref={uiContainer}
			onDrop={(e) => {
				e.preventDefault();
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
		>
			<ResizeBar
				directions={directions}
				direction={direction}
				uiContainer={uiContainer}
				resizeBarStyle={(()=>{
					let lastBarEvent = [].concat(barEvents).pop();
					if(lastBarEvent){
						return lastBarEvent.resizeBarStyle;
					} else {
						return {};
					}
				})()}
				onBarEvent={(lastBarEvent)=>{
					setBarEvents(barEvents.concat([lastBarEvent]));
				}}
			/>
			{getSection1()}
			{getSection2()}
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
			{/*
			<div className="engine">
				engine
			</div>
			<Version/>
			*/}
			<UIContainer/>
		</EngineContext.Provider>
	);
}

export default Engine;
