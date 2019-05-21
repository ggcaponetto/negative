import React, {useState, useEffect, useContext, useRef} from 'react';
import './engine.css';

const defaultEngineContext = {version: "0.0.1"};
export const EngineContext = React.createContext(defaultEngineContext);

function ResizeBar(props) {
	const [style, setStyle] = useState({});
	const resizeBar = useRef(null);
	useEffect(() => {
		console.debug(`${ResizeBar.name} useEffect`);
		setStyle({
			top: props.uiContainer.current.clientHeight - resizeBar.current.clientHeight
		});
		props.onResize({
			sectionTop: {
				top: 0, bottom: resizeBar.current.clientHeight
			},
			sectionBottom: {
				top: props.uiContainer.current.clientHeight, bottom: 0
			}
		})
	}, []);

	const handleDrag = (e) => {
		let pixelsFromTop = Math.min(e.clientY, props.uiContainer.current.clientHeight - resizeBar.current.clientHeight);
		console.debug(`${ResizeBar.name} handleDrag`, {
			e, uiContainer: props.uiContainer
		});

		setStyle({
			top: pixelsFromTop
		});

		props.onResize({
			sectionTop: {
				top: 0, bottom: props.uiContainer.current.clientHeight - pixelsFromTop
			},
			sectionBottom: {
				top: pixelsFromTop + resizeBar.current.clientHeight, bottom: 0
			}
		})
	};

	return (
		<div
			className={ResizeBar.name}
			draggable={true}
			style={style}
			ref={resizeBar}
			onDragStart={(e) => {
				console.debug(`${ResizeBar.name} onDragStart`, e);
				let ghostElement = document.createElement("div");
				ghostElement.style.display = "none"; /* or visibility: hidden, or any of the above */
				e.dataTransfer.setDragImage(ghostElement, 0, 0);
				handleDrag(e);
			}}
			onDrag={(e) => {
				e.preventDefault();
				console.debug(`${ResizeBar.name} onDrag`, e);
				handleDrag(e);
			}}
			onDragEnd={(e) => {
				console.debug(`${ResizeBar.name} onDragEnd`, e);
				handleDrag(e);
			}}
		>
			resizebar
		</div>
	)
}

function UIContainer() {
	const [resizeBarData, setResizeBarData] = useState({
		sectionTop: {
			top: 0, bottom: 0
		},
		sectionBottom: {
			top: 0, bottom: 0
		}
	});
	const uiContainer = useRef(null);

	useEffect(() => {
		console.debug(`${UIContainer.name} useEffect`);
	}, []);

	return (
		<div
			className={UIContainer.name}
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
			<div className={"section top"} style={{
				top: resizeBarData.sectionTop.top, bottom: resizeBarData.sectionTop.bottom
			}}>
				{JSON.stringify(resizeBarData.sectionTop)}
			</div>
			<div className={"section bottom"} style={{
				top: resizeBarData.sectionBottom.top, bottom: resizeBarData.sectionBottom.bottom
			}}>
				{JSON.stringify(resizeBarData.sectionBottom)}
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
