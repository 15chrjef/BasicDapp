import { ReactiveComponent } from 'oo7-react'
import { AccountIcon} from 'parity-reactive-ui';

import React from 'react'

export class VoteOption extends ReactiveComponent {
	constructor(){
		super(['votes', 'enabled', 'already']);
	}
	readyRender() {
		const s = { float: 'left', minWidth: '5em' }
		if(!this.state.enabled) s.cursor = 'not-allowed';
		return (
			<span style={{ float:'right', marginBottom: '10px' }}>
				<a
					style={s}
					href='#'
					onClick={this.props.vote}
				>
						{this.props.label}
				</a>
				<span style={{borderRight: `${1 + this.state.votes * 10}px black solid`}}/>
				{this.state.already.map(a => (<AccountIcon
					style={{width: '1.2em', verticalAlign: 'bottom', marginLeft: '1ex'}}
					key={a}
					address={a}
				/>))}
			</span>
		)
	}
}