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
	const directions = {column: "column", row: "row"};
	const [direction, setDirection] = useState(directions.column);
	const uiContainer = useRef(null);
	const resizeBar = useRef(null);
	const [resizeBarInfos, setResizeBarInfos] = useState([]);

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

		let lastResizeInfo = [].concat(resizeBarInfos).pop();

		if(!lastResizeInfo){
			// return the default position
			return defaultStyle;
		} else {
			return  {
				position: "absolute",
				cursor: "move",
				width: "fit-content",
				top: lastResizeInfo.cappedResizeBarTopBorderPosition,
				left: lastResizeInfo.cappedResizeBarLeftBorderPosition,
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
				onDragStart={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDragStart`, e);
					let ghostElement = document.createElement("div");
					ghostElement.style.display = "none"; /* or visibility: hidden, or any of the above */
					e.dataTransfer.setDragImage(ghostElement, 0, 0);
					handleDrag(e);
				}}
				onDrag={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDrag`, e);
					handleDrag(e);
				}}
				onDragEnd={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDragEnd`, e);
					handleDrag(e);
				}}
				onDragExit={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDragExit`, e);
					handleDrag(e);
				}}
				onDragLeave={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDragLeave`, e);
					handleDrag(e);
				}}
				onDrop={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onDrop`, e);
					handleDrag(e);
				}}
				onTouchStart={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onTouchStart`, e);
					handleDrag(e);
				}}
				onTouchMove={(e) => {
					e.persist();
					// e.preventDefault();
					console.debug(`${UIContainer.name} onTouchMove`, e);
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
		if (isTouch && e.touches[0]) {
			resizeBarTopBorderPosition = e.touches[0].clientY;
			resizeBarLeftBorderPosition = e.touches[0].clientX;
		} else {
			resizeBarTopBorderPosition = e.clientY;
			resizeBarLeftBorderPosition = e.clientX;
		}

		let containerHeight = uiContainer.current.clientHeight;
		let containerWidth = uiContainer.current.clientWidth;

		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarWidth = resizeBar.current.clientWidth;


		let cappedResizeBarTopBorderPosition = resizeBarTopBorderPosition;
		let cappedResizeBarLeftBorderPosition = resizeBarLeftBorderPosition;

		// Detect when the user moves outside of the window or container
		let lastResizeInfo = [].concat(resizeBarInfos).pop();
		let isOverflowEvent = false;
		if(resizeBarTopBorderPosition < 0){
			// top overflow
			console.debug(`${UIContainer.name} handleDrag - overflow top`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastResizeInfo.cappedResizeBarTopBorderPosition;
			// cappedResizeBarLeftBorderPosition = lastResizeInfo.cappedResizeBarLeftBorderPosition;
		}
		if(resizeBarLeftBorderPosition < 0){
			// left overflow
			console.debug(`${UIContainer.name} handleDrag - overflow left`);
			isOverflowEvent = true;
			// cappedResizeBarTopBorderPosition = lastResizeInfo.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastResizeInfo.cappedResizeBarLeftBorderPosition;
		}
		if(Math.max(resizeBarLeftBorderPosition, 0) > containerWidth - resizeBarWidth){
			// right overflow
			console.debug(`${UIContainer.name} handleDrag - overflow right`);
			isOverflowEvent = true;
			// cappedResizeBarTopBorderPosition = lastResizeInfo.cappedResizeBarTopBorderPosition;
			cappedResizeBarLeftBorderPosition = lastResizeInfo.cappedResizeBarLeftBorderPosition;
		}
		if(Math.max(resizeBarTopBorderPosition, 0) > containerHeight - resizeBarHeight){
			// bottom overlfow
			console.debug(`${UIContainer.name} handleDrag - overflow bottom`);
			isOverflowEvent = true;
			cappedResizeBarTopBorderPosition = lastResizeInfo.cappedResizeBarTopBorderPosition;
			// cappedResizeBarLeftBorderPosition = lastResizeInfo.cappedResizeBarLeftBorderPosition;
		}

		setResizeBarInfos(resizeBarInfos.concat([{
			e, cappedResizeBarTopBorderPosition, cappedResizeBarLeftBorderPosition, containerHeight, containerWidth, resizeBarHeight, resizeBarWidth, isOverflowEvent
		}]));

		console.debug(`${UIContainer.name} handleDrag - all`, resizeBarInfos);

	};

	useEffect(() => {
		console.debug(`${UIContainer.name} useEffect`);
	}, []);

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
