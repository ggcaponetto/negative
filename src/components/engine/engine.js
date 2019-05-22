import React, {useState, useEffect, useContext, useRef} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

function ResizeBar(props) {
	const [style, setStyle] = useState({});
	const resizeBar = useRef(null);
	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect`);
		let containerHeight = props.uiContainer.current.clientHeight;
		let resizeBarHeight = resizeBar.current.clientHeight;
		let resizeBarTopBorderPosition = containerHeight - resizeBarHeight;
		// Cap the resizeBarTopBorderPosition.
		// On mouse release the clientY could be negative or higher than te container height
		let cappedResizeBarTopBorderPosition = Math.min(Math.max(resizeBarTopBorderPosition, 0), containerHeight - resizeBarHeight);

		console.debug(`${ResizeBar.name} handleDrag`, {
			resizeBarTopBorderPosition, resizeBarHeight, containerHeight, uiContainer: props.uiContainer
		});

		setStyle({
			top: cappedResizeBarTopBorderPosition
		});
		props.onResize({cappedResizeBarTopBorderPosition, resizeBarHeight})
	}, []);

	const handleDrag = (e) => {

		// Detect if the event comes from a touch enabled device
		let isTouch = e.touches;

		let resizeBarTopBorderPosition = e.clientY;
		if(isTouch && e.touches[0]){
			resizeBarTopBorderPosition = e.touches[0].clientY;
		} else {
			resizeBarTopBorderPosition = e.clientY;
		}
		let containerHeight = props.uiContainer.current.clientHeight;
		let resizeBarHeight = resizeBar.current.clientHeight;
		// Cap the resizeBarTopBorderPosition.
		// On mouse release the clientY could be negative or higher than te container height
		let cappedResizeBarTopBorderPosition = Math.min(Math.max(resizeBarTopBorderPosition, 0), containerHeight - resizeBarHeight);

		console.debug(`${ResizeBar.name} handleDrag`, {
			e, resizeBarTopBorderPosition, resizeBarHeight, containerHeight, uiContainer: props.uiContainer
		});

		setStyle({
			top: cappedResizeBarTopBorderPosition
		});

		props.onResize({cappedResizeBarTopBorderPosition, resizeBarHeight})
	};

	return (
		<div
			className={ResizeBar.name}
			draggable={true}
			style={style}
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
			resizebar
		</div>
	)
}

function UIContainer() {
	const directions = {column: "column", row: "row"};
	const [resizeBarData, setResizeBarData] = useState(null);
	const [direction, setDirection] = useState(directions.column);

	const uiContainer = useRef(null);

	useEffect(() => {
		console.debug(`${UIContainer.name} useEffect`);
	}, []);

	const getTopSection = () => {
		if(resizeBarData){
			return (
				<div className={"section top"} style={{
					top: 0,
					bottom: uiContainer.current.clientHeight - resizeBarData.cappedResizeBarTopBorderPosition
				}}>
					{JSON.stringify(resizeBarData, null, 4)}
				</div>
			)
		} else {
			return null;
		}
	};

	const getBottomSection = () => {
		if(resizeBarData){
			return (
				<div className={"section bottom"} style={{
					top: resizeBarData.cappedResizeBarTopBorderPosition + resizeBarData.resizeBarHeight,
					bottom: 0
				}}>
					{JSON.stringify(resizeBarData, null, 4)}
				</div>
			)
		} else {
			return null;
		}
	};

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
				uiContainer={uiContainer}
				onResize={(resizeBarData) => {
					setResizeBarData(resizeBarData);
				}}
			/>
			{getTopSection()}
			{getBottomSection()}
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
