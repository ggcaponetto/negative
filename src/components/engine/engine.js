import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Tab(props) {
	useEffect(() => {
		let bc = new BroadcastChannel(props.broadcastChannelName);
		bc.postMessage(`Engine sent message to ${null}`);
		bc.onmessage = function (e) { console.debug(`Engine got message from ${null}`, e); }
	}, []);
	return (
		<div
		>
			{JSON.stringify(props)}
		</div>
	);
}

function Engine() {
	const [uiConfig, setUiConfig] = useState(null);
	useEffect(() => {
		let defautlConfig = {
			tabs: [
				{
					name: "Tab1",
					broadcastChannelName: defaultEngineContext.broadcastChannelName
				},
				{
					name: "Tab2",
					broadcastChannelName: defaultEngineContext.broadcastChannelName
				},
				{
					name: "Tab3",
					broadcastChannelName: defaultEngineContext.broadcastChannelName
				},
			]
		};
		setUiConfig(defautlConfig);
	}, []);

	const getEngine = () => {
		return (
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}}>
				<button onClick={() => {
					uiConfig.tabs.forEach((tabConfig) => {
						let tab = window.open(`/tab`, `_blank`);
					});
				}}>load ui
				</button>
			</div>
		);
	};
	return (
		<EngineContext.Provider value={defaultEngineContext}>
			{/*
			<div className="engine">
				engine
			</div>
			<Version/>
			*/}
			<Router>
				<Route path="/engine" component={getEngine} />
				<Route path="/tab" component={Tab} />
			</Router>
		</EngineContext.Provider>
	);
}

export default Engine;
