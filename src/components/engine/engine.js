import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

function ResizeBar(props) {
	const resizeBar = useRef(null);
	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect`);
		initialSetup(props.direction, props.directions);
		return () => {
			console.debug(`${ResizeBar.name} useEffect - cleanup`);
		}
	}, [props.direction]);

	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect - rendering`);
		return () => {
			console.debug(`${ResizeBar.name} useEffect - rendering - cleanup`);
		}
	});

	const initialSetup = (direction, directions) => {
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
		if (direction === directions.column) {
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
			props.onResizeBarStyleChange(columnStyle);
		}
		else if (direction === directions.row) {
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
			props.onResizeBarStyleChange(rowStyle);
		}
		props.onResize({
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth
		})
	};
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
			props.onResizeBarStyleChange(columnStyle);
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
			props.onResizeBarStyleChange(rowStyle);
		}
		props.onResize({
			cappedResizeBarTopBorderPosition,
			cappedResizeBarLeftBorderPosition,
			resizeBarHeight,
			resizeBarWidth
		})
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
	const [resizeBarData, setResizeBarData] = useState(null);
	const [resizeBarStyle, setResizeBarStyle] = useState({});
	const [direction, setDirection] = useState(directions.row);
	const uiContainer = useRef(null);

	function getSection1(){
		if (resizeBarData) {
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
							bottom: uiContainer.current.clientHeight - resizeBarData.cappedResizeBarTopBorderPosition
						}}
					>
						{JSON.stringify(resizeBarData, null, 4)}
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
							right: uiContainer.current.clientWidth - resizeBarData.cappedResizeBarLeftBorderPosition,
						}}
					>
						{JSON.stringify(resizeBarData, null, 4)}
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
		if (resizeBarData) {
			if (direction === directions.column) {
				return (
					<div className={"section two"} style={{
						position: "absolute",
						overflow: "auto",
						top: resizeBarData.cappedResizeBarTopBorderPosition + resizeBarData.resizeBarHeight,
						left: 0,
						right: 0,
						bottom: 0
					}}>
						{JSON.stringify(resizeBarData, null, 4)}
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
						left: resizeBarData.cappedResizeBarLeftBorderPosition + resizeBarData.resizeBarWidth,
					}}>
						{JSON.stringify(resizeBarData, null, 4)}
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
				flexDirection: direction
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
				resizeBarStyle={resizeBarStyle}
				onResizeBarStyleChange={(data) => {
					setResizeBarStyle(data);
				}}
				onResize={(data) => {
					setResizeBarData(data);
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
