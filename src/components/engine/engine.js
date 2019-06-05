import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import './engine.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Tab} from "../tab/tab";

const defaultEngineContext = {
	version: "0.0.1",
	broadcastChannelName: "negative"
};
export const EngineContext = React.createContext(defaultEngineContext);

function Engine() {
	const [uiConfig, setUiConfig] = useState(null);
	useEffect(() => {
		let defautlConfig = {
			tabs: [
				{
					id: "1",
					name: "Tab1",
					broadcastChannelName: defaultEngineContext.broadcastChannelName,
					data: {
						direction: "vertical",
						split1: {
							data: {
								direction: "vertical",
							}
						},
						split2: {
							data: {
								direction: "vertical",
							}
						},
						testFunction: () => {
							alert("hello world 1")
						}
					}
				}/*,
				{
					id: "2",
					name: "Tab2",
					broadcastChannelName: defaultEngineContext.broadcastChannelName,
					data: {
						direction: "horizontal",
						testFunction: () => {
							alert("hello world 2")
						}
					}
				},
				{
					id: "3",
					name: "Tab3",
					broadcastChannelName: defaultEngineContext.broadcastChannelName,
					data: {
						direction: "horizontal",
						testFunction: () => {
							alert("hello world 3")
						}
					}
				},*/
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
						let tab = window.open(`/tab/${tabConfig.id}`, `_blank`);
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
				<Route
					path="/engine"
					render={(props) => {
						console.debug(`props`, props);
						return getEngine();
					}}
				/>
				<Route
					path="/tab/:id"
					render={(props) => {
						let tabId = props.match.params.id;
						console.debug(`props`, {tabId, props});
						if(uiConfig){
							return <Tab {...props} tabConfig={uiConfig.tabs.filter(tab => tab.id === tabId)[0]}/>;
						} else {
							return null;
						}
					}}
				/>
			</Router>
		</EngineContext.Provider>
	);
}

export default Engine;
