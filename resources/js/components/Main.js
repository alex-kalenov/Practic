import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"; 

const Button = styled.button`
	width: 215px;
	padding: 16px 0 16px;
	border-radius: 6px;
	border: ${(props) => (props.disabled ? "2px solid #dadada" : "none")};
  	background-color: ${(props) => (props.disabled ? "white" : "#0085be")};
  	color: ${(props) => (props.disabled ? "#dadada" : "white")};
  	line-height: 1.15;
  	pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  	:hover {
  		background-color: #02597e;
  	}
  	:active {
  		background-color: #002abe;
  	}
  	:focus {
  		outline: none;
  	}
`;

const TableRow = styled.li`
	background-color: ${(props) => 
		props.type === "heading" && '#f0f0f0' ||
		props.type === "row-strip" && '#fafafa' ||
		'white'};
	font-weight: ${(props) => (props.type === "heading" ? 700 : 400)};
	padding: 16px 27px 16px 0;
	display: flex;
`;

const TableColumn = styled.div`
	position: relative;
	padding: ${(props) => (props.type === "checkbox" ? '0 20px 0' : 'unset')};
	flex-basis: ${(props) => 
		props.type === "id" && '6%' ||
		props.type === "name" && '24%' ||
		props.type === "age" && '13%' ||
		props.type === "height" && '12%' ||
		props.type === "weight" && '10%' ||
		'unset'};
	flex-grow: ${(props) => props.type === "salary" ? 1 : 'unset'};
`;

const TableRowButton = styled.button`
	padding: 0;
	width: 23px;
	height: 24px;
	background: ${(props) => 
		props.action === "delete" && "url('../img/delete.svg') no-repeat center/contain;" ||
		props.action === "update" && "url('../img/update.svg') no-repeat center/contain;"};
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: ${(props) => 
		props.action === "delete" && "27px" ||
		props.action === "update" && "75px"};
	border: none;
	:focus {
		outline: none;
	}
	:hover {
		background: ${(props) => 
			props.action === "delete" && "url('../img/delete-hover.svg') no-repeat center/contain;" ||
			props.action === "update" && "url('../img/update-hover.svg') no-repeat center/contain;"};
	}
`;

class CheckBox extends Component {
	constructor() {
	    super();
	    this.state = { checked: false };
	    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
	}

	handleCheckboxClick() {
		this.setState({checked: !this.state.checked});
		if(this.state.checked)
			this.props.updateCheckedRows(false);
		else this.props.updateCheckedRows(true);
	}
    	
	handleCheckboxChange() { }

	componentDidUpdate(prevProps) {
		if (this.props.checked !== prevProps.checked) {
		  	this.setState({checked: this.props.checked});
		}
	}

	render() {
		return (
			<div className="CheckBox" onClick={this.handleCheckboxClick}>
			  <input type="checkbox" checked={this.state.checked} onChange={this.handleCheckboxChange}/>
			  <div className="CheckBox__checkmark"></div>
			</div>
		);
	}
}

function heightConvert(age_string) {
	const regex1 = /^\d+/;
	let foot = parseInt(age_string.match(regex1));
	const regex2 = /\d+$/;
	let inch = parseInt(age_string.match(regex2));
	let cm_total = Math.trunc((foot*12+inch)*2.54);
	let m = Math.trunc(cm_total/100);
	let cm = Math.trunc((cm_total/100-m)*100);
	return (m + 'м ' + cm + 'см');
}

class Table extends Component {

	constructor() {
	    super();
	    this.state = {
	        employees: [], checkedAll: false,
	    }
	    this.rowsCount = 0;
	    this.deleteRow = this.deleteRow.bind(this);
	    this.updateAllCheckedRows = this.updateAllCheckedRows.bind(this);
	}

	componentDidMount() {
		let i = 0;
	    fetch('/api/employees')
	        .then(response => {
	            return response.json();
	        })
	        .then(employees => {
	            this.setState({ employees });
	            return employees;
	        })
	        .then(employees => {
	        	this.rowsCount = this.state.employees.length;
	        });
	}

	deleteRow(id) {
		fetch('/api/employees/' + id, {
		  method: 'DELETE',
		})
		.then(res => res.json())
		.then(res => console.log(res));
		fetch('/api/employees')
	        .then(response => {
	            return response.json();
	        })
	        .then(employees => {
	            this.setState({ employees });
	            return this.state.employees;
	        })
	        .then(employees => {
	        	this.rowsCount = this.state.employees.length;
	        });
	}

	updateAllCheckedRows(toggle) {
		if(toggle) {
			this.setState({checkedAll: true});
			this.props.updateAllCheckedRows(this.rowsCount);
		}
		else {
			this.setState({checkedAll: false});
			this.props.updateAllCheckedRows(0);
		}  
	}

	renderEmployees() {
		let index = 0;
		let RowType = '';
	    return this.state.employees.map((employee) => {
	    	if(index % 2) 
	    		RowType = 'row-strip';
	    	else
	    		RowType = '';
	    	index++;
	        return (
		        <TableRow key={employee.id} type={RowType}>
		        	<TableColumn type="checkbox"><CheckBox checked={this.state.checkedAll} 
		        		updateCheckedRows={this.props.updateCheckedRows}></CheckBox></TableColumn>
	        		<TableColumn type="id">{employee.id}</TableColumn>
	        		<TableColumn type="name">{employee.first_name + ' ' + employee.last_name}</TableColumn>
	        		<TableColumn type="age">{Math.trunc(employee.date_of_birth/31556926)}</TableColumn>
	        		<TableColumn type="height">{heightConvert(employee.height)}</TableColumn>
	        		<TableColumn type="weight">{Math.trunc(employee.weight*0.45) + ' кг'}</TableColumn>
	        		<TableColumn type="salary">{'$' + employee.salary}</TableColumn>
	        		<TableRowButton action="update"></TableRowButton>
		            <TableRowButton action="delete" onClick={() => this.deleteRow(employee.id)}></TableRowButton>
		        </TableRow>      
		    );
	    })
	}

	render() {
	    return (
	        <ul>
	        	<TableRow type="heading">
	        		<TableColumn type="checkbox"><CheckBox checked={this.state.checkedAll}
	        			updateCheckedRows={this.updateAllCheckedRows} checkedRows={this.props.checkedRows}
	        			rowsCount={this.rowsCount} type="heading"></CheckBox></TableColumn>
	        		<TableColumn type="id">№</TableColumn>
	        		<TableColumn type="name">ФИО</TableColumn>
	        		<TableColumn type="age">Возраст(лет)</TableColumn>
	        		<TableColumn type="height">Рост</TableColumn>
	        		<TableColumn type="weight">Вес</TableColumn>
	        		<TableColumn type="salary">Зарплата</TableColumn>
	        	</TableRow>
	        	{ this.renderEmployees() }
	        </ul>
	    );
  	}
}

class ButtonPanel extends Component {

	constructor() {
	    super();  
	}

	render() {
	    return (
	    	<div className="ButtonPanel">
		    	<Button disabled={!this.props.anyCheckedRows}>Удалить выбранные</Button>
	    	</div>
	    )};
}

class Main extends Component {

	constructor() {
	    super();
	    this.checkedRows = 0;
	    this.state = {
	    	anyCheckedRows: false,
	    }
	    this.updateCheckedRows = this.updateCheckedRows.bind(this);
	    this.updateAllCheckedRows = this.updateAllCheckedRows.bind(this);
	}

	updateCheckedRows(increment) {
		let state = this.state.anyCheckedRows;
	    if(increment)
	    	this.checkedRows++;
	    else
	    	this.checkedRows--;
	    if(this.checkedRows > 0 && !state)
	    	this.setState({ anyCheckedRows:true });
	    else if(this.checkedRows == 0)
	    	this.setState({ anyCheckedRows:false });
	    //console.log(this.checkedRows);
	}

	updateAllCheckedRows(rowsCount) {
		this.checkedRows = rowsCount;
		if(this.checkedRows == 0)
			this.setState({ anyCheckedRows:false });
		else
			this.setState({ anyCheckedRows:true });
		//console.log(this.checkedRows);
	}

	render() {
	    return (
	    	<div>
	    		<Table updateCheckedRows={this.updateCheckedRows} updateAllCheckedRows={this.updateAllCheckedRows}
	    			checkedRows={this.checkedRows}></Table>
	    		<ButtonPanel anyCheckedRows={this.state.anyCheckedRows}></ButtonPanel>
	    	</div>
	    );
	}
}
 
export default Main;

/* The if statement is required so as to Render the component on pages that have a div with an ID of "root";  
*/
 
if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}