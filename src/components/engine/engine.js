import React, {useState, useEffect, useContext, useRef} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

function ResizeBar(props) {
	const directions = props.directions;
	const direction = props.direction;
	const [style, setStyle] = useState({});
	const resizeBar = useRef(null);
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

		console.debug(`${ResizeBar.name} handleDrag`, {
			resizeBarTopBorderPosition, cappedResizeBarLeftBorderPosition, resizeBarHeight, resizeBarWidth, containerHeight, uiContainer: props.uiContainer
		});

		if(direction === directions.column){
			let columnStyle = {
				top: cappedResizeBarTopBorderPosition,
				left: 0,
				right: 0
			};
			setStyle(columnStyle);
		}
		else if(direction === directions.row){
			let rowStyle = {
				top: 0,
				bottom: 0,
				left: cappedResizeBarLeftBorderPosition,
			};
			setStyle(rowStyle);
		}
		props.onResize({cappedResizeBarTopBorderPosition, cappedResizeBarLeftBorderPosition, resizeBarHeight, resizeBarWidth})
	}, []);

	const handleDrag = (e) => {
		let isTouch = e.touches;

		let resizeBarTopBorderPosition = e.clientY;
		let resizeBarLeftBorderPosition = e.clientX;
		if(isTouch && e.touches[0]){
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
			e, resizeBarTopBorderPosition, cappedResizeBarLeftBorderPosition, resizeBarHeight, resizeBarWidth, containerHeight, uiContainer: props.uiContainer
		});

		if(direction === directions.column){
			let columnStyle = {
				top: cappedResizeBarTopBorderPosition,
				left: 0,
				right: 0
			};
			setStyle(columnStyle);
		}
		else if(direction === directions.row){
			let rowStyle = {
				top: 0,
				bottom: 0,
				left: cappedResizeBarLeftBorderPosition,
			};
			setStyle(rowStyle);
		}

		props.onResize({cappedResizeBarTopBorderPosition, cappedResizeBarLeftBorderPosition, resizeBarHeight, resizeBarWidth})

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
			resizebar ({direction})
		</div>
	)
}

function UIContainer() {
	const directions = {column: "column", row: "row"};
	const [resizeBarData, setResizeBarData] = useState(null);
	const [direction, setDirection] = useState(directions.row);

	const uiContainer = useRef(null);

	useEffect(() => {
		console.debug(`${UIContainer.name} useEffect`);
	}, []);

	const getSection1 = () => {
		if(resizeBarData){
			if(direction === directions.column){
				return (
					<div className={"section one"} style={{
						top: 0,
						left: 0,
						right: 0,
						bottom: uiContainer.current.clientHeight - resizeBarData.cappedResizeBarTopBorderPosition
					}}>
						{JSON.stringify(resizeBarData, null, 4)}
					</div>
				)
			}
			else if(direction === directions.row){
				return (
					<div className={"section one"} style={{
						top: 0,
						bottom: 0,
						left: 0,
						right: uiContainer.current.clientWidth - resizeBarData.cappedResizeBarLeftBorderPosition,
					}}>
						{JSON.stringify(resizeBarData, null, 4)}
					</div>
				)
			}
		} else {
			return null;
		}
	};

	const getSection2 = () => {
		if(resizeBarData){
			if(direction === directions.column){
				return (
					<div className={"section two"} style={{
						top: resizeBarData.cappedResizeBarTopBorderPosition + resizeBarData.resizeBarHeight,
						left: 0,
						right: 0,
						bottom: 0
					}}>
						{JSON.stringify(resizeBarData, null, 4)}
					</div>
				)
			}
			else if(direction === directions.row){
				return (
					<div className={"section two"} style={{
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
				directions={directions}
				direction={direction}
				uiContainer={uiContainer}
				onResize={(resizeBarData) => {
					setResizeBarData(resizeBarData);
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
