import React from 'react';
import { Counter } from './counter'
import {Bond, TimeBond} from 'oo7';
import {TransactButton, InputBond, HashBond, BButton, TransactionProgressLabel} from 'parity-reactive-ui';

const CounterABI = [
	{"constant":false,"inputs":[{"name":"_option","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
	{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
	{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
	{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"option","type":"uint256"}],"name":"Voted","type":"event"}
]
const CounterCodeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const CounterCode = '\0x6060604052341561000f57600080fd5b5b61027b8061001f6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630121b93f1461005457806309eef43e146100775780635df81330146100c8575b600080fd5b341561005f57600080fd5b61007560048080359060200190919050506100ff565b005b341561008257600080fd5b6100ae600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610217565b604051808215151515815260200191505060405180910390f35b34156100d357600080fd5b6100e96004808035906020019091905050610237565b6040518082815260200191505060405180910390f35b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561015657600080fd5b6000808281526020019081526020016000206000815480929190600101919050555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550803373ffffffffffffffffffffffffffffffffffffffff167f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca460405160405180910390a35b50565b60016020528060005260406000206000915054906101000a900460ff1681565b600060205280600052604060002060009150905054815600a165627a7a72305820f803ceb94c676f8cbe6fd7b1848ed5de9cc75061fc3b571f038e3efbdc1fd1110029'

export class App extends React.Component {
	constructor(){
		super()
		this.state = { counter: window.localStorage.counter ? bonds.makeContract(window.localStorage.counter, CounterABI) : null}
		this.deploy = this.deploy.bind(this)		
		this.addr = new Bond()
		this.addr.then(v => {
			window.localStorage.counter = v
			let counter = bonds.makeContract(v, CounterABI)
			this.setState({ tx: null, counter})
		})
	}
	deploy() {
		let tx = bonds.deployContract(CounterCode, CounterABI)
		tx.done(s => {
			this.setState({counter: s.deployed})
			window.localStorage.counter = s.deployed.address
		})
		return tx
	}
	renderDeployButtonOrContract(){
		return (
			!!this.state.counter ? <Counter contract={this.state.counter}/>
			: <div>
					<TransactButton content='Deploy' tx={this.deploy} statusText/>
				</div>
		)
	}
	render() {
		const votingEnabled = Bond.all([this.voted, this.state.tx]).map(([v,t]) => !v && (!t || !!t.failed ))
		return (
			<div style={{ position: 'absolute', left: '300px' }}>
				{this.renderDeployButtonOrContract()}
				<span style={{margin: '2em'}}>OR</span>
<InputBond bond={this.addr} validator={v => v.startsWith('0x') && v.length == 42 && bonds.code(v).map(_ => parity.api.util.sha3(_) == CounterCodeHash) ? v : null}/>
			</div>
		);
	}
}

