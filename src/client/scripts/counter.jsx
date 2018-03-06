import React from 'react';
import {Bond, TimeBond} from 'oo7';
import {Rspan, Rimg} from 'oo7-react';
import {InputBond, HashBond, BButton, TransactionProgressLabel} from 'parity-reactive-ui';
import {bonds, formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import { VoteOption } from './VoteOption'
		window.bonds = bonds

const Options = ['Red', 'Green', 'Blue'];

const CounterABI = [
	{"constant":false,"inputs":[{"name":"_option","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
	{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
	{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
	{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"option","type":"uint256"}],"name":"Voted","type":"event"}
]

export class Counter extends React.Component {
	constructor(){
		super()
		this.state = { tx: null}
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}
	componentWillReceiveProps(){
		this.voted = this.props.contract.hasVoted(bonds.me);
		this.prevVote = this.props.contract.Voted({ who: bonds.me });
		this.prevVotes = this.props.contract.Voted({ who: bonds.accounts });
	}
	render() {
		const votingEnabled = Bond.all([this.voted, this.state.tx]).map(([v,t]) => !v && (!t || !!t.failed ))
		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'column'}}>
				{Options.map((n, i) => (
					<VoteOption 
						key={i}
						label={n}
						votes={this.props.contract.votes(i)}
						vote={() => this.setState({tx: this.props.contract.vote(i)} )}
						enabled={votingEnabled}
						already={this.prevVotes.map(a => a.filter(x => x.option == i).map(x => x.who))}
					/>
				))}
				</div>
				{/* <Rspan>
					{this.prevVote.map(v => v.length > 0 ? `Already voted for ${Options[v[0].option]}` : '')}
				</Rspan> */}
				<div style={{marginTop: '1em'}}>
					<TransactionProgressLabel value={this.state.tx}/>
				</div>
				<div style={{fontSize: 'small'}}>
					Using contract at {this.props.contract.address}
				</div>
			</div>
		);
	}
}