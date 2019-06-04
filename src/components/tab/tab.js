import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import Split from 'split.js/dist/split.js'
import "./tab.css";

export function Component(props){
	useEffect(() =>{
		Split(['.split-1', '.split-2'], {
			direction: props.direction,
			elementStyle: (dimension, size, gutterSize) => ({
				'flex-basis': `calc(${size}% - ${gutterSize}px)`,
			}),
			gutterStyle: (dimension, gutterSize) => ({
				'flex-basis':  `${gutterSize}px`,
			}),
		})
	}, []);
	let getFlexDirection = () => {
		if(props.direction === "vertical"){
			return "column";
		} else if (props.direction === "horizontal"){
			return "row";
		} else {
			throw new Error(`direction "${props.direction}" is not supported`);
		}
	};
	return (
		<div className={`flex ${props.direction}`} style={{flexDirection: getFlexDirection()}}>
			<div className={"split-1"}></div>
			<div className={"split-2"}></div>
		</div>
	);
}

export function Tab(props) {
	const [broadcastChannel, setBroadcastChannel] = useState(null);
	useEffect(() => {
		console.debug(`useEffect`, props);
		let broadcastChannel = new BroadcastChannel(props.broadcastChannelName);
		setBroadcastChannel(broadcastChannel);
		broadcastChannel.onmessage = function (e) {
			console.debug(`Engine got message`, e);
		}
	}, []);
	return (
		<Component {...props} direction={props.tabConfig.data.direction}/>
	);
}