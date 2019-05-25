import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

/*function ResizeBar(props) {
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
		} else if (props.direction === props.directions.row) {
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
		} else if (props.direction === props.directions.row) {
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

		props.onBarEvent({
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth,
			resizeBarStyle
		});

		return () => {
			console.debug(`${ResizeBar.name} useEffect`);
		}
	}, [props.barEvents]);

	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect - barEvents`);
		let lastBarEvent = [].concat(barEvents).pop();
		console.debug(`${ResizeBar.name} useEffect - barEvents`, {lastBarEvent});
		props.onBarEvent(lastBarEvent);
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
		} else if (props.direction === props.directions.row) {
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

	const getResizebarStyle = () => {
		let lastBarEvent = [].concat(barEvents).pop();
		if (lastBarEvent) {
			return lastBarEvent.resizeBarStyle;
		}
		return {}
	};

	return (

	)
}*/

function UIContainer() {
	const hookClassName = "UIContainer";
	const directions = {column: "column", row: "row"};
	const [direction, setDirection] = useState(directions.column);
	const uiContainer = useRef(null);
	const resizeBar = useRef(null);
	//const [resizeBarInfos, setResizeBarInfos] = useState([]);

	const [gestures, setGestures] = useState([]);

	const getSection1 = () => {
		if (direction === directions.column) {
			return (
				<div
					className={"section one"}
					style={{}}
				>
					{/*{JSON.stringify(lastBarEvent, null, 4)}*/}
					{/*{getFlipDirectionButton()}*/}
				</div>
			)
		} else if (direction === directions.row) {
			return (
				<div
					className={"section one"}
					style={{}}
				>
					{/*{JSON.stringify(lastBarEvent, null, 4)}*/}
					{/*{getFlipDirectionButton()}*/}
				</div>
			)
		}
	};
	const getSection2 = () => {
		if (direction === directions.column) {
			return (
				<div className={"section two"} style={{}}>
					{/*{JSON.stringify(lastBarEvent, null, 4)}*/}
				</div>
			)
		} else if (direction === directions.row) {
			return (
				<div className={"section two"} style={{}}>
					{/*{JSON.stringify(lastBarEvent, null, 4)}*/}
				</div>
			)
		}
	};
	const getFlipDirectionButton = () => {
		return (
			<button
				onClick={() => {
					let newDirection = direction === directions.column ? directions.row : directions.column;
					setDirection(newDirection);
				}}>
				direction swap
			</button>
		)
	};
	const getResizeBarStyle = () => {
		let defaultStyle = {
			position: "absolute",
			cursor: "move",
			width: "fit-content",
			top: 0,
			left: 0,
		};

		let lastGesture = [].concat(gestures).pop();
		let lastGestureEvent = [].concat(lastGesture).pop();

		if(!lastGestureEvent){
			// return the default position
			return defaultStyle;
		} else {
			return  {
				position: "absolute",
				cursor: "move",
				width: "fit-content",
				top: lastGestureEvent.cappedResizeBarTopBorderPosition,
				left: lastGestureEvent.cappedResizeBarLeftBorderPosition,
			}
		}
	};
	const getResizeBar = () => {
		return (
			<div
				className={"resizebar"}
				draggable={true}
				style={getResizeBarStyle()}
				ref={resizeBar}
				onDrag={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDrag`, e);
					handleDrag(e);
				}}
				onDragStart={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDragStart`, e);
					let ghostElement = document.createElement("div");
					ghostElement.style.display = "none"; /* or visibility: hidden, or any of the above */
					e.dataTransfer.setDragImage(ghostElement, 0, 0);
					handleDrag(e);
				}}
				onDragEnd={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDragEnd`, e);
					handleDrag(e);
				}}
				onDragExit={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDragExit`, e);
					handleDrag(e);
				}}
				onDragLeave={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDragLeave`, e);
					handleDrag(e);
				}}
				onDrop={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onDrop`, e);
					handleDrag(e);
				}}
				onTouchStart={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onTouchStart`, e);
					handleDrag(e);
				}}
				onTouchMove={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onTouchMove`, e);
					handleDrag(e);
				}}
				onTouchEnd={(e) => {
					e.persist();
					// e.preventDefault();
					// console.debug(`${hookClassName} onTouchEnd`, e);
					handleDrag(e);
				}}
			>
				resizebar ({direction})
			</div>
		);
	};
	const handleDrag = (e) => {
		let isTouch = e.touches;

		let resizeBarTopBorderPosition = null;
		let resizeBarLeftBorderPosition = null;
		if (
			isTouch &&
			e.touches.length > 0 &&
			e.touches[0]
		) {
			resizeBarTopBorderPosition = e.touches[0].clientY;
			resizeBarLeftBorderPosition = e.touches[0].clientX;
		} else if(
			typeof e.clientX !== "undefined" &&
			typeof e.clientY !== "undefined"
		){
			resizeBarTopBorderPosition = e.clientY;
			resizeBarLeftBorderPosition = e.clientX;
		} else {
			return;
		}

		let containerHeight = uiContainer.current.clientHeight;
		let containerWidth = uiContainer.current.clientWidth;

		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarWidth = resizeBar.current.clientWidth;


		let cappedResizeBarTopBorderPosition = resizeBarTopBorderPosition;
		let cappedResizeBarLeftBorderPosition = resizeBarLeftBorderPosition;

		// Detect when the user moves outside of the window or container
		let lastGesture = [].concat(gestures).pop();
		let lastGestureEvent = [].concat(lastGesture).pop();
		let isOverflowEvent = false;
		if(resizeBarTopBorderPosition < 0){
			// top overflow
			console.debug(`${hookClassName} handleDrag - overflow top`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastGestureEvent.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastGestureEvent.cappedResizeBarLeftBorderPosition;
		}
		if(resizeBarLeftBorderPosition < 0){
			// left overflow
			console.debug(`${hookClassName} handleDrag - overflow left`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastGestureEvent.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastGestureEvent.cappedResizeBarLeftBorderPosition;
		}
		if(Math.max(resizeBarLeftBorderPosition, 0) > containerWidth - resizeBarWidth){
			// right overflow
			console.debug(`${hookClassName} handleDrag - overflow right`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastGestureEvent.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastGestureEvent.cappedResizeBarLeftBorderPosition;
		}
		if(Math.max(resizeBarTopBorderPosition, 0) > containerHeight - resizeBarHeight){
			// bottom overlfow
			console.debug(`${hookClassName} handleDrag - overflow bottom`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastGestureEvent.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastGestureEvent.cappedResizeBarLeftBorderPosition;
		}

		let gestureEvent = {
			e,
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			containerHeight,
			containerWidth,
			resizeBarHeight,
			resizeBarWidth,
			isOverflowEvent
		};


		const addEventToCurrentGesture = () => {
			let newGestures = gestures.concat([]);
			let lastGestureEvents = newGestures.pop();
			lastGestureEvents.push(gestureEvent);
			newGestures.push(lastGestureEvents);
			setGestures(newGestures);
			// console.debug(`${hookClassName} - event - addEventToCurrentGesture`, {gestureEvent, gestures});
		};
		const addEventToNewGesture = () => {
			let newGestures = gestures.concat([]);
			newGestures.push([
				gestureEvent
			]);
			setGestures(newGestures);
		};

		if(e.type === "drag"){
			console.debug(`${hookClassName} - event - drag`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "dragstart"){
			console.debug(`${hookClassName} - event - dragstart`, {gestureEvent, gestures});
			addEventToNewGesture()
		}
		if(e.type === "dragend"){
			console.debug(`${hookClassName} - event - dragend`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "dragexit"){
			console.debug(`${hookClassName} - event - dragexit`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "dragleave"){
			console.debug(`${hookClassName} - event - dragleave`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "drop"){
			console.debug(`${hookClassName} - event - dragleave`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "touchstart"){
			console.debug(`${hookClassName} - event - touchstart`, {gestureEvent, gestures});
			addEventToNewGesture();
		}
		if(e.type === "touchmove"){
			console.debug(`${hookClassName} - event - touchmove`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
		if(e.type === "touchend"){
			console.debug(`${hookClassName} - event - touchend`, {gestureEvent, gestures});
			addEventToCurrentGesture();
		}
	};

	useEffect(() => {
		console.debug(`${hookClassName} useEffect`);
	}, []);

	return (
		<div
			className={hookClassName}
			style={{
				display: "flex",
				flexDirection: direction,
				flex: 1,
				position: "relative"
			}}
			ref={uiContainer}
			onDrop={(e) => {
			}}
			onDragOver={(e) => {
			}}
		>
			{/*{getSection1()}
			{getSection2()}*/}
			{getResizeBar()}
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
